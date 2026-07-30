// Read + aggregate analytics for the dashboard (server-only).
// Optionally gated by ANALYTICS_TOKEN — when set, callers must supply it.

import { env } from "../env";
import type { AnalyticsSummary } from "@/features/analytics/types";
import { getAnalyticsStore } from "./store";
import { computeSummary } from "./aggregate";

export interface SummaryResult {
  authorized: boolean;
  /** True when no ANALYTICS_TOKEN is configured (dashboard is open). */
  open?: boolean;
  summary?: AnalyticsSummary;
}

export async function getSummary(token?: string): Promise<SummaryResult> {
  const required = env("ANALYTICS_TOKEN");
  if (required && token !== required) return { authorized: false };
  const events = await getAnalyticsStore().readAll();
  return { authorized: true, open: !required, summary: computeSummary(events) };
}
