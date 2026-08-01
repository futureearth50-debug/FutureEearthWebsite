// Server-side event recording (server-only). Enriches events before storing:
// visitor questions are tagged with their nearest FAQ so paraphrases collapse
// in "most common questions". Dynamically imported inside server-fn handlers.

import type { Locale } from "@/content/site";
import type { AnalyticsEventInput, Qualification, StoredEvent } from "@/features/analytics/types";
import { getAnalyticsStore } from "./store";
import { searchFaq } from "@/server/kb";

/** Record a client-emitted event (started / question). */
export async function recordEvent(input: AnalyticsEventInput): Promise<void> {
  const ev: StoredEvent = { type: input.type, ts: Date.now(), conversationId: input.conversationId };

  if (input.type === "started") {
    ev.locale = input.locale;
    ev.page = input.page;
    ev.referrer = input.referrer;
  } else {
    ev.turn = input.turn;
    ev.text = input.text.slice(0, 500);
    const res = searchFaq(input.text);
    ev.confidence = res.confidence;
    if (res.top && res.confidence !== "low") {
      ev.faqId = res.top.entry.id;
      ev.faqQuestion = res.top.entry.question;
    }
  }

  await getAnalyticsStore().append(ev);
}

/** Record the authoritative "completed" event from the analysis pipeline. */
export async function recordCompleted(args: {
  conversationId?: string;
  leadId: string;
  score: number;
  qualification: Qualification;
  startedAt?: number;
  page?: string;
  locale: Locale;
}): Promise<void> {
  if (!args.conversationId) return; // nothing to attribute the completion to
  await getAnalyticsStore().append({
    type: "completed",
    ts: Date.now(),
    conversationId: args.conversationId,
    leadId: args.leadId,
    score: args.score,
    qualification: args.qualification,
    durationMs: args.startedAt ? Math.max(0, Date.now() - args.startedAt) : undefined,
    page: args.page,
    locale: args.locale,
  });
}
