// Client analytics helpers. Recording is strictly fire-and-forget: analytics
// must never block, delay, or break the conversation.

import { recordEventFn } from "./serverFns";
import type { AnalyticsEventInput } from "./types";

/** Short, unique conversation id used to stitch a visitor's events together. */
export function newConversationId(): string {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Record an event without awaiting; all errors are swallowed. */
export function recordEvent(event: AnalyticsEventInput): void {
  try {
    void recordEventFn({ data: event }).catch(() => {});
  } catch {
    /* analytics is best-effort — never surface to the user */
  }
}
