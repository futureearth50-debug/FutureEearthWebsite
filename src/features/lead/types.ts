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

export interface LeadContact {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  role?: string;
  location?: string;
}

/** Structured result produced by Gemini once the conversation is complete. */
export interface LeadAnalysis {
  summary: string;
  qualification: Qualification;
  score: number; // 0–100
  contact: LeadContact;
  projectType?: string;
  budget?: string;
  timeline?: string;
  insights: string[];
  recommendedAction: string;
}

export interface ChatRequest {
  locale: Locale;
  messages: ChatMessage[];
}

export interface AnalyzeResponse {
  leadId: string;
  analysis: LeadAnalysis;
  /** Whether the WhatsApp notification to the sales team was dispatched. */
  notified: boolean;
}
