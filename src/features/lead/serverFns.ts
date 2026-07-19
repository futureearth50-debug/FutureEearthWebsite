// Server functions for the AI Lead Qualification Assistant.
//
// This is the bridge the client imports. TanStack Start compiles each
// `.handler()` body into a server endpoint and replaces it with a fetch call in
// the browser bundle. The node-dependent logic under `@/server/**` is pulled in
// via dynamic `import()` INSIDE the handlers, so it never enters the client
// graph (and stays clear of the import-protection guard on `**/server/**`).
//
// `chatStreamFn` returns a raw streaming `Response` (passed straight through to
// the browser); `analyzeLeadFn` returns a serializable JSON result.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AnalyzeResponse } from "./types";

const chatSchema = z.object({
  locale: z.enum(["en", "ar"]),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      }),
    )
    .max(60),
});

export const chatStreamFn = createServerFn({ method: "POST" })
  .validator(chatSchema)
  .handler(async ({ data }): Promise<Response> => {
    const { streamAssistantReply } = await import("@/server/lead/engine");
    return streamAssistantReply(data.locale, data.messages);
  });

export const analyzeLeadFn = createServerFn({ method: "POST" })
  .validator(chatSchema)
  .handler(async ({ data }): Promise<AnalyzeResponse> => {
    const { analyzeAndDispatch } = await import("@/server/lead/engine");
    return analyzeAndDispatch(data.locale, data.messages);
  });
