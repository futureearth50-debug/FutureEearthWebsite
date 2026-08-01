// Chatbot analytics dashboard (internal). Reads the aggregated summary via
// `analyticsSummaryFn`; if ANALYTICS_TOKEN is configured on the server, a token
// must be supplied (?token=… in the URL or the prompt below).

import { useCallback, useEffect, useState } from "react";
import {
  MessageSquare, CheckCircle2, Flame, TrendingUp, Clock, Gauge, HelpCircle, LogOut, FileBarChart,
} from "lucide-react";
import { analyticsSummaryFn } from "@/features/analytics/summaryFn";
import type { AnalyticsSummary } from "@/features/analytics/types";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "unauth" }
  | { status: "ready"; summary: AnalyticsSummary };

const pct = (n: number) => `${Math.round(n * 100)}%`;
const dur = (ms: number) => {
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;
};

export function AnalyticsPage() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [token, setToken] = useState("");

  const load = useCallback(async (tok?: string) => {
    setState({ status: "loading" });
    try {
      const res = await analyticsSummaryFn({ data: { token: tok || undefined } });
      if (!res.authorized) setState({ status: "unauth" });
      else if (res.summary) setState({ status: "ready", summary: res.summary });
      else setState({ status: "error" });
    } catch {
      setState({ status: "error" });
    }
  }, []);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token") ?? "";
    setToken(t);
    void load(t);
  }, [load]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--fe-navy)", color: "#fff", padding: "clamp(1.25rem, 4vw, 3rem)" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div className="flex items-center gap-3" style={{ marginBottom: 8 }}>
          <FileBarChart size={22} style={{ color: "var(--fe-amber)" }} />
          <h1 className="fe-display" style={{ fontSize: "1.7rem", fontWeight: 600 }}>Chatbot Analytics</h1>
        </div>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginBottom: 28 }}>
          AI assistant performance across the site.
        </p>

        {state.status === "loading" && <Muted>Loading…</Muted>}
        {state.status === "error" && <Muted>Couldn’t load analytics. Try again shortly.</Muted>}

        {state.status === "unauth" && (
          <div style={{ maxWidth: 380 }}>
            <Muted>This dashboard is protected. Enter the access token.</Muted>
            <div className="flex gap-2" style={{ marginTop: 12 }}>
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load(token)}
                placeholder="Access token"
                className="fe-field"
                style={{ background: "rgba(255,255,255,0.06)", color: "#fff", borderColor: "rgba(255,255,255,0.15)" }}
              />
              <button className="fe-btn fe-btn-primary" onClick={() => load(token)}>Unlock</button>
            </div>
          </div>
        )}

        {state.status === "ready" && <Dashboard s={state.summary} />}
      </div>
    </div>
  );
}

function Dashboard({ s }: { s: AnalyticsSummary }) {
  if (s.conversationsStarted === 0) {
    return <Muted>No conversations recorded yet. Chat with the assistant, then refresh.</Muted>;
  }
  return (
    <>
      <div style={gridStyle}>
        <Kpi icon={<MessageSquare size={18} />} label="Conversations started" value={s.conversationsStarted} />
        <Kpi icon={<CheckCircle2 size={18} />} label="Completed" value={s.conversationsCompleted} sub={pct(s.completionRate) + " completion"} />
        <Kpi icon={<Flame size={18} />} label="Qualified leads" value={s.qualifiedLeads} sub="Hot + Warm" accent />
        <Kpi icon={<TrendingUp size={18} />} label="Conversion rate" value={pct(s.conversionRate)} />
        <Kpi icon={<Gauge size={18} />} label="Avg lead score" value={s.avgScore.toFixed(0) + " / 100"} />
        <Kpi icon={<Clock size={18} />} label="Avg duration" value={s.avgDurationMs ? dur(s.avgDurationMs) : "—"} />
      </div>

      {/* Tier distribution */}
      <Section title="Lead quality">
        <div className="flex gap-2 flex-wrap">
          <Tier label="Hot" n={s.tierCounts.Hot} color="#E1841A" />
          <Tier label="Warm" n={s.tierCounts.Warm} color="#F5A623" />
          <Tier label="Cold" n={s.tierCounts.Cold} color="#6E98BF" />
        </div>
      </Section>

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        {/* Common questions */}
        <Section title="Most common questions" icon={<HelpCircle size={15} />}>
          {s.commonQuestions.length === 0 ? (
            <Muted>No questions captured yet.</Muted>
          ) : (
            <ol style={{ margin: 0, paddingInlineStart: 0, listStyle: "none" }}>
              {s.commonQuestions.map((q, i) => (
                <li key={i} style={rowStyle}>
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13.5 }} dir="auto">{q.question}</span>
                  <span style={countPill}>{q.count}</span>
                </li>
              ))}
            </ol>
          )}
        </Section>

        {/* Drop-off */}
        <Section title="Drop-off points" icon={<LogOut size={15} />}>
          {s.dropOff.length === 0 ? (
            <Muted>No drop-offs — everyone who started, finished. 🎉</Muted>
          ) : (
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {s.dropOff.map((d, i) => (
                <li key={i} style={rowStyle}>
                  <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13.5 }}>
                    After {d.turn} {d.turn === 1 ? "message" : "messages"}
                  </span>
                  <span style={countPill}>{d.count}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      {/* Top pages */}
      <Section title="Pages generating the most leads">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ color: "rgba(255,255,255,0.5)", textAlign: "left" }}>
              <th style={thStyle}>Page</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Started</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Completed</th>
            </tr>
          </thead>
          <tbody>
            {s.topPages.map((p, i) => (
              <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <td style={{ padding: "9px 8px", color: "rgba(255,255,255,0.85)" }} dir="auto">{p.page}</td>
                <td style={{ padding: "9px 8px", textAlign: "right" }}>{p.started}</td>
                <td style={{ padding: "9px 8px", textAlign: "right", color: "var(--fe-amber)", fontWeight: 600 }}>{p.completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 24 }}>
        {s.totalEvents} events · generated {new Date(s.generatedAt).toLocaleString()}
      </div>
    </>
  );
}

// ── Small presentational bits ────────────────────────────────────────────────
const gridStyle: React.CSSProperties = {
  display: "grid",
  gap: 14,
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  marginBottom: 20,
};
const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 16,
  padding: "16px 18px",
};
const rowStyle: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
  padding: "8px 0", borderTop: "1px solid rgba(255,255,255,0.07)",
};
const thStyle: React.CSSProperties = { padding: "0 8px 8px", fontWeight: 500, fontSize: 12 };
const countPill: React.CSSProperties = {
  flexShrink: 0, background: "rgba(245,166,35,0.16)", color: "var(--fe-amber)",
  borderRadius: 999, padding: "2px 10px", fontSize: 12.5, fontWeight: 600,
};

function Kpi({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: React.ReactNode; sub?: string; accent?: boolean }) {
  return (
    <div style={{ ...cardStyle, ...(accent ? { background: "rgba(245,166,35,0.10)", borderColor: "rgba(245,166,35,0.3)" } : {}) }}>
      <div className="flex items-center gap-2" style={{ color: accent ? "var(--fe-amber)" : "rgba(255,255,255,0.55)", fontSize: 12.5 }}>
        {icon}<span>{label}</span>
      </div>
      <div className="fe-display" style={{ fontSize: "1.9rem", fontWeight: 600, marginTop: 8, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ ...cardStyle, marginTop: 20 }}>
      <div className="flex items-center gap-2" style={{ color: "var(--fe-amber)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>
        {icon}<span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Tier({ label, n, color }: { label: string; n: number; color: string }) {
  return (
    <div style={{ flex: 1, minWidth: 90, background: "rgba(255,255,255,0.04)", border: `1px solid ${color}44`, borderRadius: 12, padding: "12px 14px" }}>
      <div className="flex items-center gap-1.5" style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: color }} />{label}
      </div>
      <div className="fe-display" style={{ fontSize: "1.5rem", fontWeight: 600, marginTop: 4 }}>{n}</div>
    </div>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{children}</div>;
}
