import { createStart, createMiddleware, createCsrfMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

// Protect same-origin server-function RPC endpoints (e.g. the lead assistant's
// chat + analysis functions, which trigger AI calls and WhatsApp notifications)
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

// Per-IP rate limiting for the chatbot RPC endpoints (chat, analysis, analytics),
// protecting the AI/quota + email/WhatsApp from scripted abuse. The limiter lives
// under `@/server/**`; it's dynamically imported so it never enters the client
// bundle (and stays clear of the import-protection guard).
const rateLimitMiddleware = createMiddleware().server(async (ctx) => {
  if (ctx.handlerType === "serverFn") {
    const { enforceRateLimit } = await import("@/server/rateLimit");
    const limited = enforceRateLimit(ctx.request, ctx.pathname);
    if (limited) return limited; // 429 — short-circuit before the handler runs
  }
  return ctx.next();
});

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, rateLimitMiddleware, errorMiddleware],
}));
