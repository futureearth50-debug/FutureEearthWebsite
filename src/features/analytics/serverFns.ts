// Server function for recording chatbot analytics events (client-imported bridge).
// Node-only logic lives under `@/server/analytics/**` and is pulled in via a
// dynamic import inside the handler (kept out of the client bundle).
//
// The summary/read server fn lives in ./summaryFn — one server fn per module,
// which the TanStack splitter handles reliably here.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const eventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("started"),
    conversationId: z.string().min(1).max(64),
    locale: z.enum(["en", "ar"]),
    page: z.string().max(300).optional(),
    referrer: z.string().max(500).optional(),
  }),
  z.object({
    type: z.literal("question"),
    conversationId: z.string().min(1).max(64),
    turn: z.number().int().min(0).max(200),
    text: z.string().min(1).max(4000),
  }),
]);

/** Record a client analytics event (fire-and-forget from the UI). */
export const recordEventFn = createServerFn({ method: "POST" })
  .validator(eventSchema)
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const { recordEvent } = await import("@/server/analytics/record");
    await recordEvent(data);
    return { ok: true };
  });
