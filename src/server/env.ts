// Server-only environment access.
//
// Reads configuration from `process.env`. For local development it lazily
// hydrates any *missing* keys from a project-root `.env` file (Vite's dev server
// does not populate `process.env` with un-prefixed vars, and we deliberately
// keep secrets un-prefixed so they never reach the client bundle). In production
// the host's real environment variables are already present and win.
//
// This module must only ever be imported from server code (server functions,
// or modules dynamically imported inside a server-function handler).

import fs from "node:fs";
import path from "node:path";

let hydrated = false;

function hydrateFromDotEnv(): void {
  // In production the host's real env vars are authoritative and .env is ignored
  // after the first pass. In development we re-read on every access so edits to
  // .env take effect without restarting the server.
  const isProd = process.env.NODE_ENV === "production";
  if (isProd && hydrated) return;
  hydrated = true;
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) return;
    const raw = fs.readFileSync(envPath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!key) continue;
      // Prod: fill only missing keys (never clobber real env). Dev: .env wins.
      if (isProd ? process.env[key] === undefined : true) process.env[key] = value;
    }
  } catch {
    // Best effort — a missing/unreadable .env is fine when real env vars exist.
  }
}

/** Read an env var as a string, falling back to `fallback` when unset/empty. */
export function env(key: string, fallback = ""): string {
  hydrateFromDotEnv();
  const value = process.env[key];
  return value === undefined || value === "" ? fallback : value;
}

/** Read an env var as a boolean (`"true"`/`"1"`/`"yes"` are truthy). */
export function envBool(key: string, fallback = false): boolean {
  const value = env(key, "").toLowerCase();
  if (value === "") return fallback;
  return value === "true" || value === "1" || value === "yes" || value === "on";
}

/** Read a required env var, throwing a clear error when it is missing. */
export function requireEnv(key: string): string {
  const value = env(key);
  if (!value) {
    throw new Error(
      `Missing required environment variable "${key}". Set it in your .env file (local) or your host's environment (production).`,
    );
  }
  return value;
}
