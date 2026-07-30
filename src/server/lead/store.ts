// Lead persistence (server-only).
//
// Persistence is behind a `LeadStore` interface so it can be swapped for a real
// database later without touching the rest of the app. The default writes JSON
// records to `data/leads/` at the project root and appends a one-line summary to
// `data/leads/index.jsonl`. All writes are best-effort: on a read-only file
// system (e.g. some serverless targets) it degrades to logging rather than
// throwing, so lead capture + WhatsApp notification never fail because of disk.

import fs from "node:fs/promises";
import path from "node:path";
import type { Locale } from "@/content/site";
import type { ChatMessage, LeadAnalysis } from "@/features/lead/types";

export interface LeadRecord {
  id: string;
  createdAt: string;
  locale: Locale;
  messages: ChatMessage[];
  analysis: LeadAnalysis;
}

export interface LeadStore {
  save(record: LeadRecord): Promise<void>;
}

class FileLeadStore implements LeadStore {
  private dir = path.resolve(process.cwd(), "data", "leads");

  async save(record: LeadRecord): Promise<void> {
    try {
      await fs.mkdir(this.dir, { recursive: true });
      await fs.writeFile(
        path.join(this.dir, `${record.id}.json`),
        JSON.stringify(record, null, 2),
        "utf8",
      );
      const indexLine =
        JSON.stringify({
          id: record.id,
          createdAt: record.createdAt,
          locale: record.locale,
          qualification: record.analysis.qualification,
          score: record.analysis.score,
          name: record.analysis.profile.fullName ?? "",
          company: record.analysis.profile.company ?? "",
        }) + "\n";
      await fs.appendFile(path.join(this.dir, "index.jsonl"), indexLine, "utf8");
    } catch (err) {
      // Never let persistence break the request; the record is still logged.
      console.error("[lead-store] failed to persist lead, logging instead:", err);
      console.info("[lead-store] lead record:", JSON.stringify(record));
    }
  }
}

let store: LeadStore = new FileLeadStore();

/** Swap the persistence implementation (e.g. inject a DB-backed store). */
export function setLeadStore(next: LeadStore): void {
  store = next;
}

export function getLeadStore(): LeadStore {
  return store;
}

/** Short, sortable, collision-resistant id: `lead_<base36 time>_<rand>`. */
export function newLeadId(): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `lead_${Date.now().toString(36)}_${rand}`;
}
