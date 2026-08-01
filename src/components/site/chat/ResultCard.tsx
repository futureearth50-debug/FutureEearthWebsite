// The "qualified" result view shown once the conversation completes and the
// lead has been scored. Shared by the floating widget and the Contact panel.

import { CheckCircle2, MessageCircle, RotateCcw, Sparkles, TrendingUp } from "lucide-react";
import { contactInfo, leadAssistant, type Locale } from "@/content/site";
import type { LeadAnalysis, LeadProfile, Qualification } from "@/features/lead/types";

const TIER_COLOR: Record<Qualification, string> = {
  Hot: "#E1841A",
  Warm: "#F5A623",
  Cold: "#3E6690",
};

const MONO_LABEL = {
  fontSize: 10.5,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "var(--fe-steel-2)",
};

/** The concrete profile fields worth surfacing to the sales rep, in order. */
function detailRows(p: LeadProfile, locale: Locale): { label: string; value: string }[] {
  const ar = locale === "ar";
  const rows: { label: string; value?: string }[] = [
    { label: ar ? "المشروع" : "Project", value: p.projectType },
    { label: ar ? "الإطار الزمني" : "Timeline", value: p.timeline },
    { label: ar ? "الميزانية" : "Budget", value: p.budget },
    { label: ar ? "القطاع" : "Industry", value: p.industry },
    { label: ar ? "نوع النشاط" : "Business", value: p.businessType },
    { label: ar ? "الموقع" : "Location", value: [p.city, p.country].filter(Boolean).join(ar ? "، " : ", ") },
    { label: ar ? "التواصل المفضّل" : "Prefers", value: p.preferredContact },
  ];
  return rows.filter((r): r is { label: string; value: string } => Boolean(r.value));
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 58;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(100, score)) / 100);
  return (
    <div className="fe-la-ring">
      <svg width="132" height="132" viewBox="0 0 132 132">
        <circle cx="66" cy="66" r={r} fill="none" stroke="var(--fe-line)" strokeWidth="10" />
        <circle
          cx="66"
          cy="66"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.1s var(--fe-ease)" }}
        />
      </svg>
      <div className="fe-la-ring-num">
        <div
          className="fe-display"
          style={{ fontSize: "2rem", fontWeight: 600, color: "var(--fe-navy)", lineHeight: 1 }}
        >
          {score}
        </div>
        <div className="fe-mono" style={{ fontSize: 10, color: "var(--fe-slate-2)", marginTop: 2 }}>
          / 100
        </div>
      </div>
    </div>
  );
}

export function ResultCard({
  locale,
  analysis,
  onRestart,
}: {
  locale: Locale;
  analysis: LeadAnalysis;
  onRestart: () => void;
}) {
  const t = leadAssistant[locale];
  const tierColor = TIER_COLOR[analysis.qualification];
  const details = detailRows(analysis.profile, locale);

  return (
    <div className="fe-la-result">
      <div className="flex items-center gap-2 fe-eyebrow" style={{ color: "var(--fe-green)" }}>
        <CheckCircle2 size={16} /> {t.doneEyebrow}
      </div>
      <h3
        className="fe-display mt-3"
        style={{ fontSize: "1.55rem", fontWeight: 600, color: "var(--fe-navy)", lineHeight: 1.15 }}
      >
        {t.doneTitle}
      </h3>
      <p className="mt-2.5" style={{ color: "var(--fe-slate)", fontSize: "0.95rem", lineHeight: 1.6 }}>
        {t.doneSub}
      </p>

      {/* Score + tier */}
      <div
        className="flex flex-wrap items-center gap-6 mt-7 pt-7"
        style={{ borderTop: "1px solid var(--fe-line)" }}
      >
        <ScoreRing score={analysis.score} color={tierColor} />
        <div className="flex-1 min-w-[180px] space-y-3">
          <div>
            <div
              className="fe-mono"
              style={{
                fontSize: 10.5,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--fe-slate-2)",
              }}
            >
              {t.scoreLabel}
            </div>
            <span className={`fe-la-tier ${analysis.qualification} mt-2`}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: tierColor }} />
              {t.tiers[analysis.qualification]}
            </span>
          </div>
          {(analysis.profile.fullName || analysis.profile.company) && (
            <div style={{ fontSize: "0.92rem", color: "var(--fe-navy)" }}>
              {analysis.profile.fullName && (
                <div style={{ fontWeight: 600 }}>{analysis.profile.fullName}</div>
              )}
              {analysis.profile.company && (
                <div style={{ color: "var(--fe-slate)" }}>{analysis.profile.company}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Buying intent */}
      {analysis.buyingIntent && (
        <div
          className="mt-6 rounded-2xl p-4 flex items-start gap-2.5"
          style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.22)" }}
        >
          <TrendingUp size={16} style={{ color: "var(--fe-amber-deep)", marginTop: 2, flexShrink: 0 }} />
          <div>
            <div className="fe-mono" style={MONO_LABEL}>
              {t.intentLabel}
            </div>
            <p className="mt-1" style={{ color: "var(--fe-navy)", fontSize: "0.92rem", lineHeight: 1.5 }}>
              {analysis.buyingIntent}
            </p>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-7">
        <div className="fe-mono" style={MONO_LABEL}>
          {t.summaryLabel}
        </div>
        <p className="mt-2" style={{ color: "var(--fe-slate)", fontSize: "0.95rem", lineHeight: 1.65 }}>
          {analysis.summary}
        </p>
      </div>

      {/* Captured details */}
      {details.length > 0 && (
        <div className="mt-6">
          <div className="fe-mono" style={MONO_LABEL}>
            {t.detailsLabel}
          </div>
          <div className="mt-2.5 grid gap-x-6 gap-y-2.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
            {details.map((d) => (
              <div key={d.label}>
                <div style={{ fontSize: 11, color: "var(--fe-slate-2)" }}>{d.label}</div>
                <div style={{ fontSize: "0.9rem", color: "var(--fe-navy)", fontWeight: 500, lineHeight: 1.4 }}>
                  {d.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score breakdown */}
      {analysis.breakdown.length > 0 && (
        <div className="mt-6">
          <div className="fe-mono" style={MONO_LABEL}>
            {t.breakdownLabel}
          </div>
          <div className="mt-2.5 space-y-2">
            {analysis.breakdown.map((b) => (
              <div key={b.id}>
                <div className="flex items-center justify-between" style={{ fontSize: "0.85rem" }}>
                  <span style={{ color: "var(--fe-slate)" }}>{b.label}</span>
                  <span className="fe-mono" style={{ color: "var(--fe-navy)", fontWeight: 600 }}>
                    {b.earned}/{b.points}
                  </span>
                </div>
                <div style={{ height: 5, borderRadius: 999, background: "var(--fe-line)", marginTop: 4, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${b.points > 0 ? (b.earned / b.points) * 100 : 0}%`,
                      borderRadius: 999,
                      background: tierColor,
                      transition: "width 0.9s var(--fe-ease)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {analysis.insights.length > 0 && (
        <div className="mt-6">
          <div
            className="fe-mono"
            style={{
              fontSize: 10.5,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--fe-steel-2)",
            }}
          >
            {t.insightsLabel}
          </div>
          <div className="mt-2">
            {analysis.insights.map((ins, i) => (
              <div key={i} className="fe-la-insight">
                <span style={{ color: "var(--fe-amber-deep)", marginTop: 2 }}>
                  <Sparkles size={14} />
                </span>
                <span>{ins}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next step */}
      {analysis.recommendedAction && (
        <div
          className="mt-6 rounded-2xl p-4"
          style={{ background: "var(--fe-paper)", border: "1px solid var(--fe-line)" }}
        >
          <div
            className="fe-mono"
            style={{
              fontSize: 10.5,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--fe-steel-2)",
            }}
          >
            {t.nextLabel}
          </div>
          <p className="mt-1.5" style={{ color: "var(--fe-navy)", fontSize: "0.92rem", lineHeight: 1.55 }}>
            {analysis.recommendedAction}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-7 flex flex-wrap gap-2.5">
        <a
          href={`https://wa.me/${contactInfo.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fe-btn fe-btn-green"
          style={{ padding: "0.85rem 1.4rem", fontSize: 14 }}
        >
          <MessageCircle size={16} /> {t.talkNow}
        </a>
        <button
          onClick={onRestart}
          className="fe-btn fe-btn-outline"
          style={{ padding: "0.85rem 1.4rem", fontSize: 14 }}
        >
          <RotateCcw size={15} /> {t.newChat}
        </button>
      </div>

      <div
        className="mt-5 inline-flex items-center gap-2"
        style={{ fontSize: 12.5, color: "var(--fe-green)" }}
      >
        <CheckCircle2 size={14} /> {t.notifiedNote}
      </div>
    </div>
  );
}
