// Analytics event store (server-only).
//
// Append-only JSON Lines at `data/analytics/events.jsonl`, mirroring the lead
// store. Best-effort: on a read-only/ephemeral filesystem (some serverless
// targets) writes degrade to a console log rather than throwing, so analytics
// never breaks the chat. Swap `AnalyticsStore` for a DB/warehouse later.

import fs from "node:fs/promises";
import path from "node:path";
import type { StoredEvent } from "@/features/analytics/types";

export interface AnalyticsStore {
  append(event: StoredEvent): Promise<void>;
  readAll(): Promise<StoredEvent[]>;
}

class FileAnalyticsStore implements AnalyticsStore {
  private dir = path.resolve(process.cwd(), "data", "analytics");
  private file = path.join(this.dir, "events.jsonl");

  async append(event: StoredEvent): Promise<void> {
    try {
      await fs.mkdir(this.dir, { recursive: true });
      await fs.appendFile(this.file, JSON.stringify(event) + "\n", "utf8");
    } catch (err) {
      console.error("[analytics] failed to persist event, logging instead:", err);
      console.info("[analytics] event:", JSON.stringify(event));
    }
  }

  async readAll(): Promise<StoredEvent[]> {
    try {
      const raw = await fs.readFile(this.file, "utf8");
      const out: StoredEvent[] = [];
      for (const line of raw.split("\n")) {
        const t = line.trim();
        if (!t) continue;
        try {
          out.push(JSON.parse(t) as StoredEvent);
        } catch {
          /* skip a corrupt line */
        }
      }
      return out;
    } catch {
      return []; // no file yet
    }
  }
}

let store: AnalyticsStore = new FileAnalyticsStore();

export function setAnalyticsStore(next: AnalyticsStore): void {
  store = next;
}
export function getAnalyticsStore(): AnalyticsStore {
  return store;
}
