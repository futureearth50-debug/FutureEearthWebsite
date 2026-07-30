// Minimal, dependency-free Google Gemini REST client (server-only).
//
// Exposes exactly what the lead assistant needs:
//   • streamText   → token-by-token streaming for the live conversation.
//   • generateJson → a single structured-JSON response for lead analysis.
//
// The API key is read from the environment and never leaves the server.

import { env, envBool, requireEnv } from "./env";

const API_ROOT = "https://generativelanguage.googleapis.com/v1beta";

// Statuses that mean "try again" rather than "you did something wrong": request
// timeout, rate limit, and the 5xx family Gemini returns under load spikes
// (503 "model is currently experiencing high demand" is the common one). 4xx
// like 400/404 are NOT here — retrying them just wastes time.
const TRANSIENT_STATUS = new Set([408, 429, 500, 502, 503, 504]);

// If a rate-limit/quota error says "come back in N seconds" and N exceeds this,
// retrying is pointless — the quota won't have reset — and each retry burns
// another request from an already-exhausted budget. Bail immediately instead.
const MAX_RETRY_WAIT_MS = 8000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Number of retries after the first attempt (GEMINI_MAX_RETRIES, default 2, capped 5). */
function maxRetries(): number {
  const raw = Number(env("GEMINI_MAX_RETRIES", "2"));
  return Number.isFinite(raw) && raw >= 0 ? Math.min(Math.floor(raw), 5) : 2;
}

/** Parse a `Retry-After` header (delta-seconds or HTTP date) into ms, if present. */
function parseRetryAfter(header: string | null): number | null {
  if (!header) return null;
  const secs = Number(header);
  if (Number.isFinite(secs)) return Math.max(0, secs * 1000);
  const when = Date.parse(header);
  if (!Number.isNaN(when)) return Math.max(0, when - Date.now());
  return null;
}

/** Backoff for retry `attempt` (0-based): honor Retry-After, else exponential + jitter. */
function backoffDelay(attempt: number, retryAfter: string | null): number {
  const ra = parseRetryAfter(retryAfter);
  if (ra != null) return Math.min(ra, 8000);
  const base = 500 * 2 ** attempt; // 500ms, 1s, 2s, …
  return Math.min(base + Math.random() * 250, 6000);
}

/** Extract the provider's suggested retry delay (ms) from a 429/503: the
 *  `Retry-After` header, Google's `RetryInfo.retryDelay`, or the human message. */
function suggestedRetryMs(res: Response, bodyText: string): number | null {
  const fromHeader = parseRetryAfter(res.headers.get("retry-after"));
  if (fromHeader != null) return fromHeader;
  const info = bodyText.match(/"retryDelay"\s*:\s*"([\d.]+)s"/);
  if (info) return Math.ceil(parseFloat(info[1]) * 1000);
  const msg = bodyText.match(/retry in ([\d.]+)\s*s/i);
  if (msg) return Math.ceil(parseFloat(msg[1]) * 1000);
  return null;
}

/** Re-wrap an already-read error response so callers can still read its body. */
function rebuild(res: Response, bodyText: string): Response {
  return new Response(bodyText, {
    status: res.status,
    statusText: res.statusText,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}

// ── Quota visibility ─────────────────────────────────────────────────────────
// Log every OUTBOUND request (including retries — they cost quota too) with a
// rolling per-minute count, so free-tier usage is visible in the server console
// and near-limit spikes are obvious. `GEMINI_RPM_SOFT_LIMIT` tunes the warning
// threshold only (the real cap is set by Google).
let winStart = 0;
let winCount = 0;
let grandTotal = 0;
function trackRequest(url: string): void {
  const now = Date.now();
  if (now - winStart >= 60_000) {
    winStart = now;
    winCount = 0;
  }
  winCount += 1;
  grandTotal += 1;
  const soft = Math.max(1, Number(env("GEMINI_RPM_SOFT_LIMIT", "20")) || 20);
  const kind = url.includes("streamGenerateContent") ? "chat" : "analysis";
  const msg = `[gemini] ${winCount}/${soft} this minute · ${grandTotal} total → ${kind}`;
  if (winCount > soft) console.warn(`${msg}  ⚠ over free-tier limit — 429s likely`);
  else if (winCount >= soft * 0.75) console.warn(`${msg}  ⚠ approaching limit`);
  else console.info(msg);
}

// ── Mock mode ────────────────────────────────────────────────────────────────
// GEMINI_MOCK=true exercises the ENTIRE flow (chat → completion → scoring →
// email → analytics) with ZERO API requests, so a solo developer can iterate
// without ever touching the free-tier quota. Flip to false for real-AI testing.
function mockEnabled(): boolean {
  return envBool("GEMINI_MOCK", false);
}

function isArabic(turns: GeminiTurn[]): boolean {
  return turns.some((t) => /[؀-ۿ]/.test(t.text));
}

/** Canned streamed reply. Emits the completion token after a few exchanges so
 *  the analysis/email/analytics path can be tested end-to-end. */
function mockChatStream(turns: GeminiTurn[]): ReadableStream<string> {
  const ar = isArabic(turns);
  const userTurns = turns.filter((t) => t.role === "user").length;
  const done = userTurns >= 4; // "[[LEAD_QUALIFIED]]" is the completion marker
  const reply = ar
    ? done
      ? "شكراً لك! كانت هذه محادثة تجريبية (وضع المحاكاة). سيتواصل فريقنا معك قريباً. [[LEAD_QUALIFIED]]"
      : "استجابة تجريبية (وضع المحاكاة — لم يُستهلك أي طلب). حدثني أكثر عن مشروعك: النوع والحجم والإطار الزمني والميزانية؟"
    : done
      ? "Thank you! This was a mock conversation (simulation mode). Our team will follow up shortly. [[LEAD_QUALIFIED]]"
      : "Mock reply (simulation mode — no request used). Tell me more about your project: type, size, timeline, and budget?";
  console.info("[gemini:mock] chat reply · 0 requests used");
  const chunks = reply.split(/(\s+)/);
  return new ReadableStream<string>({
    async start(controller) {
      for (const c of chunks) {
        controller.enqueue(c);
        await sleep(12);
      }
      controller.close();
    },
  });
}

/** Canned analysis (the only caller of `generateJson`). The `scores` here drive
 *  the engine's deterministic score → ~85/Hot, so the ≥80 email path is exercised. */
function mockAnalysis(turns: GeminiTurn[]): unknown {
  const ar = isArabic(turns);
  console.info("[gemini:mock] analysis · 0 requests used");
  return {
    summary: ar
      ? "ملخص تجريبي: عميل مهتم بمشروع طاقة شمسية تجاري (وضع المحاكاة)."
      : "Mock summary: a commercial prospect interested in a solar project (simulation mode).",
    profile: {
      fullName: ar ? "عميل تجريبي" : "Test Prospect",
      company: ar ? "شركة تجريبية" : "Test Co.",
      businessType: ar ? "تجاري" : "Commercial",
      industry: ar ? "التصنيع" : "Manufacturing",
      country: ar ? "السعودية" : "Saudi Arabia",
      city: ar ? "الرياض" : "Riyadh",
      email: "test@example.com",
      phone: "0500000000",
      preferredContact: ar ? "واتساب" : "WhatsApp",
      projectType: ar ? "طاقة شمسية على الأسطح" : "Rooftop solar",
      budget: ar ? "٥٠٠ ألف ريال" : "SAR 500k",
      timeline: ar ? "٣ أشهر" : "3 months",
      goals: ar ? "خفض فاتورة الكهرباء" : "Cut the electricity bill",
      painPoints: ar ? "ارتفاع التكاليف" : "High energy costs",
      currentSolution: ar ? "الشبكة فقط" : "Grid only",
      notes: ar ? "بيانات وضع المحاكاة" : "Simulation-mode data",
    },
    scores: {
      decisionMaker: 1,
      largeCompany: 0.6,
      qualifiedBudget: 0.8,
      urgentTimeline: 0.8,
      clearNeed: 1,
      completeContact: 1,
    },
    buyingIntent: ar ? "نية شراء عالية (تجريبي)" : "High intent (mock)",
    insights: [ar ? "بيانات تجريبية للاختبار" : "Mock data for testing", ar ? "لا يُستهلك أي طلب" : "Zero requests used"],
    recommendedAction: ar ? "متابعة تجريبية مع العميل" : "Mock follow-up with the prospect",
  };
}

/**
 * POST a JSON body to Gemini, retrying on transient failures (network errors and
 * 408/429/5xx) with backoff. Returns the final `Response` — which may still be
 * non-OK for a non-transient error (e.g. 400/404) or an exhausted quota; callers
 * handle that. Retries are quota-aware: a 429 whose reset is further out than
 * `MAX_RETRY_WAIT_MS` is returned immediately rather than retried, so we don't
 * burn extra requests against a budget that's already gone.
 */
async function geminiFetch(url: string, body: string): Promise<Response> {
  const attempts = maxRetries() + 1;
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    const isLast = i === attempts - 1;
    let res: Response;
    try {
      trackRequest(url); // count every attempt (retries cost quota too)
      res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body });
    } catch (err) {
      // Network-level failure (DNS, reset, timeout): retry if attempts remain.
      lastErr = err;
      if (isLast) throw err;
      await sleep(backoffDelay(i, null));
      continue;
    }
    if (res.ok || !TRANSIENT_STATUS.has(res.status)) return res;

    // Transient error: read the body once (to inspect + free the socket).
    const bodyText = await safeText(res);
    const suggested = suggestedRetryMs(res, bodyText);

    // Don't retry a rate-limit whose reset is too far out — it just wastes quota.
    const quotaWaitTooLong =
      res.status === 429 && suggested != null && suggested > MAX_RETRY_WAIT_MS;
    if (isLast || quotaWaitTooLong) return rebuild(res, bodyText);

    await sleep(suggested != null ? Math.min(suggested, MAX_RETRY_WAIT_MS) : backoffDelay(i, null));
  }
  throw lastErr ?? new Error("Gemini request failed after retries.");
}

type GeminiRole = "user" | "model";

export interface GeminiTurn {
  role: GeminiRole;
  text: string;
}

interface GenerationConfig {
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  responseMimeType?: string;
  responseSchema?: unknown;
  thinkingConfig?: { thinkingBudget: number };
}

function model(): string {
  return env("GEMINI_MODEL", "gemini-flash-latest");
}

/** Optional thinking-token budget (`GEMINI_THINKING_BUDGET`).
 *  Send only a value the API accepts: a positive token cap (keeps replies snappy)
 *  or -1 ("dynamic"). IMPORTANT: newer flash models (gemini-flash-latest is now
 *  3.6) REJECT a budget of 0 with 400 INVALID_ARGUMENT — they can't fully disable
 *  thinking — so 0 / blank / invalid all map to "omit" (let the model decide),
 *  and `geminiRequest` additionally self-heals by retrying without the field. */
function thinkingConfig(): { thinkingBudget: number } | undefined {
  const raw = env("GEMINI_THINKING_BUDGET", "").trim();
  if (raw === "") return undefined;
  const budget = Number(raw);
  if (Number.isFinite(budget) && (budget > 0 || budget === -1)) return { thinkingBudget: budget };
  return undefined;
}

function buildBody(system: string, turns: GeminiTurn[], generationConfig: GenerationConfig) {
  return {
    systemInstruction: system ? { parts: [{ text: system }] } : undefined,
    contents: turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
    generationConfig: { ...generationConfig, thinkingConfig: thinkingConfig() },
    // Keep the assistant helpful for a sales context without being over-blocked.
    safetySettings: [
      "HARM_CATEGORY_HARASSMENT",
      "HARM_CATEGORY_HATE_SPEECH",
      "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      "HARM_CATEGORY_DANGEROUS_CONTENT",
    ].map((category) => ({ category, threshold: "BLOCK_ONLY_HIGH" })),
  };
}

/**
 * POST a built request body to Gemini with two layers of resilience:
 *   • transient retries + backoff (via `geminiFetch`), and
 *   • a self-heal: if the request 400s while carrying a `thinkingConfig`, retry
 *     once WITHOUT it. Thinking-config rules shift across model auto-upgrades
 *     (0 was valid on 3.5-flash, rejected on 3.6-flash) — this keeps the
 *     assistant working through such a change instead of hard-failing.
 */
async function geminiRequest(url: string, body: ReturnType<typeof buildBody>): Promise<Response> {
  const res = await geminiFetch(url, JSON.stringify(body));
  if (res.ok || res.status !== 400 || !body.generationConfig?.thinkingConfig) return res;
  await safeText(res); // drain the error body before replaying
  const retry = { ...body, generationConfig: { ...body.generationConfig, thinkingConfig: undefined } };
  return geminiFetch(url, JSON.stringify(retry));
}

/**
 * Stream assistant text as a `ReadableStream<string>` of incremental deltas.
 * Consumes Gemini's SSE (`alt=sse`) response and yields the text pieces.
 */
export async function streamText(
  system: string,
  turns: GeminiTurn[],
  opts: { temperature?: number; maxOutputTokens?: number } = {},
): Promise<ReadableStream<string>> {
  if (mockEnabled()) return mockChatStream(turns);

  const key = requireEnv("GEMINI_API_KEY");
  const url = `${API_ROOT}/models/${model()}:streamGenerateContent?alt=sse&key=${key}`;

  // Retry happens here, before we start reading the stream body — safe to replay.
  const res = await geminiRequest(
    url,
    buildBody(system, turns, {
      temperature: opts.temperature ?? 0.7,
      maxOutputTokens: opts.maxOutputTokens ?? 1024,
      topP: 0.95,
    }),
  );

  if (!res.ok || !res.body) {
    const detail = await safeText(res);
    throw new Error(`Gemini stream failed (${res.status}): ${detail}`);
  }

  const upstream = res.body.pipeThrough(new TextDecoderStream());

  return new ReadableStream<string>({
    async start(controller) {
      const reader = upstream.getReader();
      let buffer = "";
      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += value;
          // SSE frames are separated by a blank line.
          let sep: number;
          while ((sep = buffer.indexOf("\n\n")) !== -1) {
            const frame = buffer.slice(0, sep);
            buffer = buffer.slice(sep + 2);
            const text = extractSseText(frame);
            if (text) controller.enqueue(text);
          }
        }
        const tail = extractSseText(buffer);
        if (tail) controller.enqueue(tail);
        controller.close();
      } catch (err) {
        controller.error(err);
      } finally {
        reader.releaseLock();
      }
    },
  });
}

function extractSseText(frame: string): string {
  let out = "";
  for (const line of frame.split(/\r?\n/)) {
    const trimmed = line.trimStart();
    if (!trimmed.startsWith("data:")) continue;
    const payload = trimmed.slice(5).trim();
    if (!payload || payload === "[DONE]") continue;
    try {
      const json = JSON.parse(payload);
      const parts = json?.candidates?.[0]?.content?.parts;
      if (Array.isArray(parts)) {
        for (const part of parts) if (typeof part?.text === "string") out += part.text;
      }
    } catch {
      // Ignore partial/non-JSON keep-alive frames.
    }
  }
  return out;
}

/**
 * Ask Gemini for a single structured-JSON response validated against a schema.
 * Returns the parsed object.
 */
export async function generateJson<T>(
  system: string,
  turns: GeminiTurn[],
  responseSchema: unknown,
): Promise<T> {
  if (mockEnabled()) return mockAnalysis(turns) as T;

  const key = requireEnv("GEMINI_API_KEY");
  const url = `${API_ROOT}/models/${model()}:generateContent?key=${key}`;

  const res = await geminiRequest(
    url,
    buildBody(system, turns, {
      temperature: 0.3,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
      responseSchema,
    }),
  );

  if (!res.ok) {
    const detail = await safeText(res);
    throw new Error(`Gemini analysis failed (${res.status}): ${detail}`);
  }

  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p?.text ?? "")
    .join("");
  if (!text) throw new Error("Gemini analysis returned an empty response.");

  try {
    return JSON.parse(text) as T;
  } catch {
    // Recover if the model wrapped JSON in prose or a code fence.
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error("Gemini analysis returned invalid JSON.");
  }
}

async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 500);
  } catch {
    return "<no body>";
  }
}
