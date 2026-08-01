// Analytics types shared by the client (which emits events + renders the
// dashboard) and the server (which stores + aggregates them). No server-only deps.

export type Qualification = "Hot" | "Warm" | "Cold";

/** Events the CLIENT emits during a conversation (server adds `ts`, and tags
 *  questions with their nearest FAQ). The "completed" event is recorded
 *  server-side from the authoritative analysis — never trusted from the client. */
export type AnalyticsEventInput =
  | { type: "started"; conversationId: string; locale: "en" | "ar"; page?: string; referrer?: string }
  | { type: "question"; conversationId: string; turn: number; text: string };

/** A persisted analytics event (superset of all event shapes). */
export interface StoredEvent {
  type: "started" | "question" | "completed";
  ts: number;
  conversationId: string;
  locale?: "en" | "ar";
  page?: string;
  referrer?: string;
  // question
  turn?: number;
  text?: string;
  faqId?: string;
  faqQuestion?: string;
  confidence?: "high" | "medium" | "low";
  // completed (server-authored)
  leadId?: string;
  score?: number;
  qualification?: Qualification;
  durationMs?: number;
}

export interface CommonQuestion {
  faqId?: string;
  question: string;
  count: number;
}
export interface DropOffPoint {
  /** Number of visitor turns reached before abandoning. */
  turn: number;
  count: number;
}
export interface PageLeads {
  page: string;
  started: number;
  completed: number;
}

/** Result of a dashboard summary request (token-gated when configured). */
export interface SummaryResponse {
  authorized: boolean;
  /** True when no ANALYTICS_TOKEN is configured (dashboard is open). */
  open?: boolean;
  summary?: AnalyticsSummary;
}

export interface AnalyticsSummary {
  conversationsStarted: number;
  conversationsCompleted: number;
  qualifiedLeads: number; // Hot + Warm
  /** completed / started (0–1). */
  completionRate: number;
  /** qualified / started (0–1). */
  conversionRate: number;
  avgDurationMs: number;
  avgScore: number;
  tierCounts: Record<Qualification, number>;
  commonQuestions: CommonQuestion[];
  dropOff: DropOffPoint[];
  topPages: PageLeads[];
  totalEvents: number;
  generatedAt: number;
}
