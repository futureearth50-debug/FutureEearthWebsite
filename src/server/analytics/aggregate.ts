// Aggregates raw analytics events into the dashboard summary (server-only, pure).

import type { AnalyticsSummary, StoredEvent } from "@/features/analytics/types";

const mean = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

export function computeSummary(events: StoredEvent[]): AnalyticsSummary {
  const started = new Map<string, StoredEvent>(); // convId → first "started"
  const completed = new Map<string, StoredEvent>(); // convId → "completed"
  const maxTurn = new Map<string, number>(); // convId → furthest visitor turn
  const questions = new Map<string, { faqId?: string; question: string; count: number }>();

  for (const e of events) {
    if (e.type === "started") {
      if (!started.has(e.conversationId)) started.set(e.conversationId, e);
    } else if (e.type === "completed") {
      completed.set(e.conversationId, e);
    } else if (e.type === "question") {
      maxTurn.set(e.conversationId, Math.max(maxTurn.get(e.conversationId) ?? 0, e.turn ?? 0));
      // Group by the matched FAQ (so paraphrases collapse), else the raw text.
      const key = (e.faqQuestion || e.text || "").trim();
      if (key) {
        const rec = questions.get(key) ?? { faqId: e.faqId, question: e.faqQuestion || e.text || "", count: 0 };
        rec.count++;
        questions.set(key, rec);
      }
    }
  }

  const completedArr = [...completed.values()];
  const startedCount = started.size;
  const completedCount = completed.size;
  const qualified = completedArr.filter((c) => c.qualification === "Hot" || c.qualification === "Warm").length;

  const tierCounts = { Hot: 0, Warm: 0, Cold: 0 };
  for (const c of completedArr) if (c.qualification) tierCounts[c.qualification]++;

  // Drop-off: conversations that started but never completed, by furthest turn.
  const dropMap = new Map<number, number>();
  for (const convId of started.keys()) {
    if (completed.has(convId)) continue;
    const turn = maxTurn.get(convId) ?? 0;
    dropMap.set(turn, (dropMap.get(turn) ?? 0) + 1);
  }
  const dropOff = [...dropMap.entries()]
    .map(([turn, count]) => ({ turn, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Pages: started + completed per starting page.
  const pageMap = new Map<string, { started: number; completed: number }>();
  const bump = (pg: string | undefined, key: "started" | "completed") => {
    const page = pg || "(unknown)";
    const r = pageMap.get(page) ?? { started: 0, completed: 0 };
    r[key]++;
    pageMap.set(page, r);
  };
  for (const s of started.values()) bump(s.page, "started");
  for (const c of completedArr) bump(c.page, "completed");
  const topPages = [...pageMap.entries()]
    .map(([page, v]) => ({ page, ...v }))
    .sort((a, b) => b.completed - a.completed || b.started - a.started)
    .slice(0, 8);

  const commonQuestions = [...questions.values()].sort((a, b) => b.count - a.count).slice(0, 10);

  return {
    conversationsStarted: startedCount,
    conversationsCompleted: completedCount,
    qualifiedLeads: qualified,
    completionRate: startedCount ? completedCount / startedCount : 0,
    conversionRate: startedCount ? qualified / startedCount : 0,
    avgDurationMs: mean(completedArr.map((c) => c.durationMs ?? 0).filter((d) => d > 0)),
    avgScore: mean(completedArr.map((c) => c.score ?? 0)),
    tierCounts,
    commonQuestions,
    dropOff,
    topPages,
    totalEvents: events.length,
    generatedAt: Date.now(),
  };
}
