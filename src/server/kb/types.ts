// Knowledge-base types (server-only, but dependency-free so they may be imported
// anywhere). The data itself is generated from `knowledge-base/faq.xlsx` by
// `scripts/import-kb.mjs` into `faq.generated.ts` — see that file's header.

/** One curated question→answer pair imported from the Excel FAQ sheet. */
export interface FaqEntry {
  /** Stable id, e.g. "faq-1". Regenerated deterministically from row order. */
  id: string;
  /** The customer-facing question, Arabic preserved exactly as authored. */
  question: string;
  /** The curated answer, Arabic preserved exactly as authored. */
  answer: string;
  /** Source sheet name (supports multi-sheet workbooks). */
  sheet: string;
}

/** A single stage in the scripted qualification flow (bot sheet). */
export interface FlowStage {
  id: string;
  /** Stage label, Arabic exactly as authored, e.g. "المرحلة الأولى: تحديد نوع العميل". */
  label: string;
  order: number;
}

/** The scripted conversation flow imported from the bot sheet. */
export interface ConversationFlow {
  /** Opening message shown to the visitor, Arabic exactly as authored. */
  welcome: string;
  /** Suggested quick-reply chips for the opening turn. */
  quickReplies: string[];
  /** Ordered qualification stages the assistant should work through. */
  stages: FlowStage[];
}

/** Provenance for the generated bundle — surfaced in import logs. */
export interface KbMeta {
  generatedAt: string;
  source: string;
  faqCount: number;
  sheets: string[];
}
