// In-memory per-IP rate limiter for the chatbot's server-function endpoints
// (server-only). Fixed-window counters keyed by (client IP + endpoint), so a
// flood on one endpoint can't exhaust another. Best-effort: on multi-instance
// serverless each instance keeps its own window — combined with same-origin CSRF
// and the provider quotas, it's defense-in-depth against scripted abuse, not a
// distributed quota. Swap in Redis/Upstash later behind the same function.
//
// Tunables (env):
//   RATE_LIMIT_ENABLED    = true            (set "false" to disable)
//   RATE_LIMIT_MAX        = 30              (requests per window, per IP+endpoint)
//   RATE_LIMIT_WINDOW_MS  = 60000           (window length)

import { env, envBool } from "./env";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
let lastSweep = 0;

/** Best-effort client IP from common proxy headers (Vercel/CF/nginx). */
function clientIp(request: Request): string {
  const h = request.headers;
  const xff = h.get("x-forwarded-for");
  const ip =
    (xff ? xff.split(",")[0] : "") ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown";
  return ip.trim() || "unknown";
}

/** Endpoint bucket = the server-fn id (path segment after the base). */
function endpointKey(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  const i = parts.indexOf("_serverFn");
  return i !== -1 && parts[i + 1] ? parts[i + 1].slice(0, 24) : pathname;
}

/** Drop expired buckets occasionally so the map can't grow unbounded. */
function sweep(now: number): void {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
}

/**
 * Enforce the rate limit for a request. Returns a `429` Response to short-circuit
 * when the caller is over the limit, or `null` to allow the request through.
 */
export function enforceRateLimit(request: Request, pathname: string): Response | null {
  if (!envBool("RATE_LIMIT_ENABLED", true)) return null;

  const max = Math.max(1, Number(env("RATE_LIMIT_MAX", "30")) || 30);
  const windowMs = Math.max(1000, Number(env("RATE_LIMIT_WINDOW_MS", "60000")) || 60000);
  const now = Date.now();
  sweep(now);

  const key = `${clientIp(request)}|${endpointKey(pathname)}`;
  const b = buckets.get(key);

  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  b.count += 1;
  if (b.count > max) {
    const retryAfter = Math.max(1, Math.ceil((b.resetAt - now) / 1000));
    return new Response(JSON.stringify({ error: "rate_limited", retryAfter }), {
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": String(retryAfter),
        "cache-control": "no-store",
      },
    });
  }
  return null;
}
