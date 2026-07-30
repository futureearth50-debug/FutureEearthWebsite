// Orchestration for the lead assistant (server-only).
// Dynamically imported inside server-function handlers so none of this — nor the
// node built-ins it pulls in — can leak into the client bundle.

import type { Locale } from "@/content/site";
import type {
  AnalyzeResponse,
  ChatMessage,
  LeadAnalysis,
  LeadMeta,
  LeadProfile,
  ScoreBreakdownItem,
} from "@/features/lead/types";
import { MAX_ASSISTANT_TURNS } from "@/features/lead/types";
import { generateJson, streamText, type GeminiTurn } from "../gemini";
import {
  analysisResponseSchema,
  buildAnalysisSystemPrompt,
  buildChatSystemPrompt,
} from "./prompts";
import { buildGrounding } from "@/server/kb";
import { computeScore, scoringRubric } from "./scoring";
import { getLeadStore, newLeadId, type LeadRecord } from "./store";
import { notifySales } from "./whatsapp";
import { notifyLeadEmail } from "./email";
import { recordCompleted } from "@/server/analytics/record";

/** Raw shape returned by the analysis model (before scoring is computed). */
interface RawAnalysis {
  summary?: string;
  profile?: Record<string, unknown>;
  scores?: Record<string, unknown>;
  buyingIntent?: string;
  insights?: unknown;
  recommendedAction?: string;
}

function toGeminiTurns(messages: ChatMessage[]): GeminiTurn[] {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    text: m.content,
  }));
}

/** Stream the assistant's next message as a plain UTF-8 text `Response`. */
export async function streamAssistantReply(
  locale: Locale,
  messages: ChatMessage[],
): Promise<Response> {
  const system = buildChatSystemPrompt(locale);
  const turns = toGeminiTurns(messages);

  // Gemini requires the first content turn to be role "user". Chat surfaces seed
  // an authored welcome as the assistant's opening line (so the greeting is
  // instant and on-brand), which makes the first history entry a "model" turn —
  // drop any leading model turns so the sequence we send starts with the visitor.
  while (turns.length && turns[0].role === "model") turns.shift();

  // Kick off the conversation when there's no history yet: the model greets and
  // asks its first question. This primer is never stored in the transcript.
  if (turns.length === 0) {
    turns.push({
      role: "user",
      text: "Begin the conversation now: greet me warmly in one short sentence, then ask your first question.",
    });
  }

  // Attach retrieval-grounded KB to the LATEST user turn only, and only when the
  // message actually resembles a KB question. This keeps the system prompt stable
  // (cache-friendly) and sends a small fraction of the tokens vs. embedding the
  // whole FAQ on every turn — with no loss of grounding when it's genuinely needed.
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (lastUser) {
    const grounding = buildGrounding(lastUser.content, locale);
    if (grounding) {
      for (let i = turns.length - 1; i >= 0; i--) {
        if (turns[i].role === "user") {
          turns[i] = { role: "user", text: `${grounding}\n\n---\n\n${turns[i].text}` };
          break;
        }
      }
    }
  }

  // If the visitor is dragging on, nudge the model to wrap up.
  const assistantTurns = messages.filter((m) => m.role === "assistant").length;
  const wrapUp =
    assistantTurns >= MAX_ASSISTANT_TURNS
      ? "\n\nNOTE: The conversation is long enough. Move to your closing message now and emit the completion token."
      : "";

  // Establishing the upstream stream can fail (e.g. provider quota/auth). Return
  // a non-OK Response the client can detect, rather than throwing — a thrown
  // server-function error surfaces as an opaque 500 for a streaming handler.
  let source: ReadableStream<string>;
  try {
    source = await streamText(system + wrapUp, turns, { temperature: 0.7, maxOutputTokens: 640 });
  } catch (err) {
    console.error("[lead-engine] failed to start AI stream:", err);
    return new Response("", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
  const encoder = new TextEncoder();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = source.getReader();
      try {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) controller.enqueue(encoder.encode(value));
        }
      } catch (err) {
        console.error("[lead-engine] stream error:", err);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}

const PROFILE_KEYS: (keyof LeadProfile)[] = [
  "fullName", "company", "businessType", "industry", "country", "city",
  "email", "phone", "preferredContact", "projectType", "budget", "timeline",
  "goals", "painPoints", "currentSolution", "notes",
];

/** Keep only real string values from the model's extracted profile. */
function cleanProfile(raw: Record<string, unknown> | undefined): LeadProfile {
  const out: LeadProfile = {};
  if (!raw) return out;
  for (const key of PROFILE_KEYS) {
    const v = raw[key];
    if (typeof v === "string" && v.trim()) out[key] = v.trim();
  }
  return out;
}

function criterionLabel(id: string, locale: Locale): string {
  const c = scoringRubric.criteria.find((x) => x.id === id);
  return c ? c.label[locale] : id;
}

/** Turn the raw model output into a finished analysis: profile extracted, and
 *  score/tier/breakdown computed deterministically from the scoring rubric. */
function normalizeAnalysis(raw: RawAnalysis, locale: Locale): LeadAnalysis {
  const { score, qualification, lines } = computeScore(raw.scores);
  const breakdown: ScoreBreakdownItem[] = lines.map((l) => ({
    id: l.id,
    label: criterionLabel(l.id, locale),
    points: l.points,
    earned: l.earned,
  }));
  return {
    summary: raw.summary?.trim() || "No summary available.",
    qualification,
    score,
    breakdown,
    profile: cleanProfile(raw.profile),
    buyingIntent: raw.buyingIntent?.trim() || undefined,
    insights: Array.isArray(raw.insights) ? raw.insights.filter(Boolean).map(String) : [],
    recommendedAction: raw.recommendedAction?.trim() || "",
  };
}

/**
 * Analyze the full transcript, persist the lead, and notify sales over WhatsApp.
 * Persistence and notification are best-effort and never block the response.
 */
export async function analyzeAndDispatch(
  locale: Locale,
  messages: ChatMessage[],
  meta?: LeadMeta,
): Promise<AnalyzeResponse> {
  const system = buildAnalysisSystemPrompt(locale);
  const transcript = messages
    .map((m) => `${m.role === "assistant" ? "AI Consultant" : "Prospect"}: ${m.content}`)
    .join("\n");

  const raw = await generateJson<RawAnalysis>(
    system,
    [{ role: "user", text: `CONVERSATION TRANSCRIPT:\n\n${transcript}` }],
    analysisResponseSchema,
  );
  const analysis = normalizeAnalysis(raw, locale);

  const record: LeadRecord = {
    id: newLeadId(),
    createdAt: new Date().toISOString(),
    locale,
    messages,
    analysis,
  };

  // Persist + notify (WhatsApp + email) + record analytics concurrently; none
  // should fail the request. Email only fires for leads at/above the threshold.
  const [, notify, email] = await Promise.allSettled([
    getLeadStore().save(record),
    notifySales({ leadId: record.id, locale, analysis, messages }),
    notifyLeadEmail({ leadId: record.id, locale, analysis, messages, meta, createdAt: record.createdAt }),
    recordCompleted({
      conversationId: meta?.conversationId,
      leadId: record.id,
      score: analysis.score,
      qualification: analysis.qualification,
      startedAt: meta?.startedAt,
      page: meta?.page,
      locale,
    }),
  ]);

  const notified = notify.status === "fulfilled" ? Boolean(notify.value.ok) : false;
  const emailed =
    email.status === "fulfilled" ? Boolean(email.value.ok && !email.value.skipped) : false;

  return { leadId: record.id, analysis, notified, emailed };
}
