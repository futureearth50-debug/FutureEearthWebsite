// Shared types for the AI Lead Qualification Assistant.
// Safe to import from both client and server (no server-only dependencies).

import type { Locale } from "@/content/site";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** Sentinel the model appends once it has gathered everything it needs.
 *  It is stripped from the visible transcript and used to flip the UI into the
 *  analysis phase. Kept as a distinctive, unlikely-to-be-typed token. */
export const LEAD_COMPLETE_MARKER = "[[LEAD_QUALIFIED]]";

/** Hard ceiling on assistant turns, as a safety net against runaway loops. */
export const MAX_ASSISTANT_TURNS = 14;

export type Qualification = "Hot" | "Warm" | "Cold";

/** The full set of business fields the assistant tries to capture during the
 *  conversation. Every field is optional — the visitor volunteers what they can,
 *  and gaps are reflected in a lower score rather than blocking. */
export interface LeadProfile {
  fullName?: string;
  company?: string;
  businessType?: string;
  industry?: string;
  country?: string;
  city?: string;
  email?: string;
  phone?: string;
  preferredContact?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  goals?: string;
  painPoints?: string;
  currentSolution?: string;
  notes?: string;
}

/** One line of the transparent score breakdown (derived from the scoring rubric). */
export interface ScoreBreakdownItem {
  id: string;
  /** Localized criterion name, resolved server-side for display. */
  label: string;
  /** Max points for this criterion. */
  points: number;
  /** Points actually earned (points × the model's met-factor, rounded). */
  earned: number;
}

/** Structured result produced once the conversation is complete. `score` and
 *  `qualification` are COMPUTED from the rubric (see server/lead/scoring.ts),
 *  not free-form model output. */
export interface LeadAnalysis {
  summary: string;
  qualification: Qualification;
  score: number; // 0–100, computed
  breakdown: ScoreBreakdownItem[];
  profile: LeadProfile;
  /** Short read on the visitor's buying intent (for the sales handoff). */
  buyingIntent?: string;
  insights: string[];
  recommendedAction: string;
}

export interface ChatRequest {
  locale: Locale;
  messages: ChatMessage[];
}

/** Optional provenance captured client-side, attached to the analysis request
 *  for the sales notification (page the chat started on, referrer, device) and
 *  for analytics attribution (conversation id + start time). */
export interface LeadMeta {
  page?: string;
  referrer?: string;
  userAgent?: string;
  conversationId?: string;
  startedAt?: number;
}

export interface AnalyzeResponse {
  leadId: string;
  analysis: LeadAnalysis;
  /** Whether the WhatsApp notification to the sales team was dispatched. */
  notified: boolean;
  /** Whether a qualified-lead email was sent (false if below threshold). */
  emailed: boolean;
}
