// Public knowledge-base API (server-only).
//
// The data is generated from Excel (`faq.generated.ts`). This module exposes:
//   • the curated FAQ + scripted flow,
//   • `buildGrounding` — the RETRIEVAL grounding for a single user message: only
//     the few FAQ entries relevant to what was asked (or nothing), so the model
//     answers strictly from approved content and hands off when it isn't covered,
//     without paying to resend the whole FAQ every turn,
//   • `searchFaq` — the lexical ranker behind it (also used for analytics).

import type { Locale } from "@/content/site";
import { faqEntries, conversationFlow, kbMeta } from "./faq.generated";
import { searchFaq } from "./retrieve";

export { faqEntries, conversationFlow, kbMeta, searchFaq };
export type { FaqMatch, SearchResult, Confidence } from "./retrieve";
export type { FaqEntry, ConversationFlow, FlowStage, KbMeta } from "./types";

/** Only ground when the message really resembles a KB question (a top match this
 *  strong). Below it, the visitor is almost certainly just answering one of OUR
 *  qualifying questions, so no KB is needed — which is what keeps prompts tiny. */
const GROUND_TOP_MIN = 0.2;
/** Drop weak secondary matches so we never pad the prompt with near-misses. */
const GROUND_ITEM_MIN = 0.12;

/**
 * Retrieval-grounded knowledge for ONE user message: the few FAQ entries actually
 * relevant to what the visitor just asked, or `""` when nothing is a real match.
 *
 * This replaces injecting the whole FAQ on every turn — the model still answers
 * strictly from approved content (and hands off when there's no match), but a
 * typical conversation now sends a fraction of the tokens. The KB is authored in
 * Arabic; the model is told to answer in the visitor's language without inventing
 * beyond it.
 */
export function buildGrounding(query: string, locale: Locale, limit = 4): string {
  const { matches, top } = searchFaq(query, limit);
  if (!top || top.score < GROUND_TOP_MIN) return "";
  const header =
    locale === "ar"
      ? "معلومات من قاعدة المعرفة المعتمدة (استعن بها إذا كانت متعلقة بسؤال الزائر، ولا تخترع خارجها):"
      : "Relevant approved knowledge (use if it fits the visitor's question; never invent beyond it):";
  const lines = matches
    .filter((m) => m.score >= GROUND_ITEM_MIN)
    .map((m, i) => `${i + 1}. Q: ${m.entry.question}\n   A: ${m.entry.answer}`);
  return `${header}\n${lines.join("\n")}`;
}

/** The scripted qualification stages, as a compact ordered list for the prompt. */
export function buildFlowOutline(): string {
  return conversationFlow.stages.map((s) => `${s.order === 0 ? "•" : s.order + "."} ${s.label}`).join("\n");
}
