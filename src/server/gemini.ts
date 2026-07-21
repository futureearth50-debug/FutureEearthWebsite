// Minimal, dependency-free Google Gemini REST client (server-only).
//
// Exposes exactly what the lead assistant needs:
//   • streamText   → token-by-token streaming for the live conversation.
//   • generateJson → a single structured-JSON response for lead analysis.
//
// The API key is read from the environment and never leaves the server.

import { env, requireEnv } from "./env";

const API_ROOT = "https://generativelanguage.googleapis.com/v1beta";

// Statuses that mean "try again" rather than "you did something wrong": request
// timeout, rate limit, and the 5xx family Gemini returns under load spikes
// (503 "model is currently experiencing high demand" is the common one). 4xx
// like 400/404 are NOT here — retrying them just wastes time.
const TRANSIENT_STATUS = new Set([408, 429, 500, 502, 503, 504]);

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

/**
 * POST a JSON body to Gemini, retrying on transient failures (network errors and
 * 408/429/5xx) with exponential backoff. Returns the final `Response` — which may
 * still be non-OK for a non-transient error (e.g. 400/404); callers handle that.
 * This is what keeps a one-off provider "high demand" spike from surfacing to the
 * visitor as a broken assistant.
 */
async function geminiFetch(url: string, body: string): Promise<Response> {
  const attempts = maxRetries() + 1;
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    const isLast = i === attempts - 1;
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      });
    } catch (err) {
      // Network-level failure (DNS, reset, timeout): retry if attempts remain.
      lastErr = err;
      if (isLast) throw err;
      await sleep(backoffDelay(i, null));
      continue;
    }
    if (res.ok || !TRANSIENT_STATUS.has(res.status) || isLast) return res;
    // Transient status with retries left: drain the error body (frees the socket) and back off.
    const retryAfter = res.headers.get("retry-after");
    await safeText(res);
    await sleep(backoffDelay(i, retryAfter));
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

/** Thinking-token budget. Newer flash models "think" by default, which adds
 *  latency and consumes the output budget; 0 keeps the chat snappy. Override
 *  with GEMINI_THINKING_BUDGET (-1 = model default / dynamic). */
function thinkingConfig(): { thinkingBudget: number } | undefined {
  const raw = env("GEMINI_THINKING_BUDGET", "0");
  const budget = Number(raw);
  if (!Number.isFinite(budget) || budget < 0) return undefined;
  return { thinkingBudget: budget };
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
 * Stream assistant text as a `ReadableStream<string>` of incremental deltas.
 * Consumes Gemini's SSE (`alt=sse`) response and yields the text pieces.
 */
export async function streamText(
  system: string,
  turns: GeminiTurn[],
  opts: { temperature?: number; maxOutputTokens?: number } = {},
): Promise<ReadableStream<string>> {
  const key = requireEnv("GEMINI_API_KEY");
  const url = `${API_ROOT}/models/${model()}:streamGenerateContent?alt=sse&key=${key}`;

  // Retry happens here, before we start reading the stream body — safe to replay.
  const res = await geminiFetch(
    url,
    JSON.stringify(
      buildBody(system, turns, {
        temperature: opts.temperature ?? 0.7,
        maxOutputTokens: opts.maxOutputTokens ?? 1024,
        topP: 0.95,
      }),
    ),
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
  const key = requireEnv("GEMINI_API_KEY");
  const url = `${API_ROOT}/models/${model()}:generateContent?key=${key}`;

  const res = await geminiFetch(
    url,
    JSON.stringify(
      buildBody(system, turns, {
        temperature: 0.3,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
        responseSchema,
      }),
    ),
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
