// Server function for reading the aggregated analytics summary.
//
// Kept in its own module (not alongside recordEventFn): the TanStack server-fn
// splitter failed to register a second server fn co-located with the event
// recorder in this feature, so each analytics server fn lives in its own file.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SummaryResponse } from "./types";

const summaryTokenSchema = z.object({ token: z.string().max(200).optional() });

/** Read the aggregated analytics summary for the dashboard. */
export const analyticsSummaryFn = createServerFn({ method: "POST" })
  .validator(summaryTokenSchema)
  .handler(async ({ data }): Promise<SummaryResponse> => {
    const { getSummary } = await import("@/server/analytics/summary");
    return getSummary(data.token);
  });
