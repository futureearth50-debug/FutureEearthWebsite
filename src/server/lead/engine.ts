// Orchestration for the lead assistant (server-only).
// Dynamically imported inside server-function handlers so none of this — nor the
// node built-ins it pulls in — can leak into the client bundle.

import type { Locale } from "@/content/site";
import type { AnalyzeResponse, ChatMessage, LeadAnalysis } from "@/features/lead/types";
import { MAX_ASSISTANT_TURNS } from "@/features/lead/types";
import { generateJson, streamText, type GeminiTurn } from "../gemini";
import {
  analysisResponseSchema,
  buildAnalysisSystemPrompt,
  buildChatSystemPrompt,
} from "./prompts";
import { getLeadStore, newLeadId, type LeadRecord } from "./store";
import { notifySales } from "./whatsapp";

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

  // Kick off the conversation when there's no history yet: the model greets and
  // asks its first question. This primer is never stored in the transcript.
  if (turns.length === 0) {
    turns.push({
      role: "user",
      text: "Begin the conversation now: greet me warmly in one short sentence, then ask your first question.",
    });
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
    source = await streamText(system + wrapUp, turns, { temperature: 0.7 });
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

function clampScore(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function normalizeAnalysis(raw: Partial<LeadAnalysis>): LeadAnalysis {
  const tier = raw.qualification;
  const qualification = tier === "Hot" || tier === "Warm" || tier === "Cold" ? tier : "Cold";
  return {
    summary: raw.summary?.trim() || "No summary available.",
    qualification,
    score: clampScore(raw.score),
    contact: raw.contact ?? {},
    projectType: raw.projectType || undefined,
    budget: raw.budget || undefined,
    timeline: raw.timeline || undefined,
    insights: Array.isArray(raw.insights) ? raw.insights.filter(Boolean) : [],
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
): Promise<AnalyzeResponse> {
  const system = buildAnalysisSystemPrompt(locale);
  const transcript = messages
    .map((m) => `${m.role === "assistant" ? "AI Consultant" : "Prospect"}: ${m.content}`)
    .join("\n");

  const raw = await generateJson<Partial<LeadAnalysis>>(
    system,
    [{ role: "user", text: `CONVERSATION TRANSCRIPT:\n\n${transcript}` }],
    analysisResponseSchema,
  );
  const analysis = normalizeAnalysis(raw);

  const record: LeadRecord = {
    id: newLeadId(),
    createdAt: new Date().toISOString(),
    locale,
    messages,
    analysis,
  };

  // Persist + notify concurrently; neither should fail the request.
  const [, notify] = await Promise.allSettled([
    getLeadStore().save(record),
    notifySales({ leadId: record.id, locale, analysis, messages }),
  ]);

  const notified = notify.status === "fulfilled" ? Boolean(notify.value.ok) : false;

  return { leadId: record.id, analysis, notified };
}
