import { Users, Ruler, FileCheck2, PackageCheck, Activity, Radio, CalendarCheck, BadgeCheck, Wallet, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { services, home, type Locale } from "@/content/site";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { PageHero, SectionCTA, CTARibbon } from "@/components/site/Sections";
import installImg from "@/assets/projects/rooftop-rail-sealing.webp";
import teamImg from "@/assets/projects/rooftop-mounting-team.webp";

const stepIcons = [Users, Ruler, FileCheck2, PackageCheck];
const capIcons = [Activity, Radio, CalendarCheck, BadgeCheck];

export function ServicesPage({ locale }: { locale: Locale }) {
  const c = services[locale];
  const isRtl = locale === "ar";

  return (
    <SiteLayout locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.lead}
        image={installImg}
        imageAlt="Technician installing solar mounting rails on an industrial roof"
      />

      {/* ============ 01 — Turnkey installation (process timeline) ============ */}
      <section className="fe-section">
        <div className="fe-container">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
            {/* Sticky intro */}
            <div className="lg:sticky lg:top-28">
              <Reveal><div className="flex items-baseline gap-4"><span className="fe-index" style={{ fontSize: "1.4rem" }}>{c.turnkey.no}</span><div className="fe-eyebrow no-tick">{isRtl ? "التركيب المتكامل" : "Turnkey Installation"}</div></div></Reveal>
              <Reveal delay={0.1}><h2 className="fe-display fe-h2 mt-4" style={{ fontWeight: 600 }}>{c.turnkey.headline}</h2></Reveal>
              <Reveal delay={0.15}>
                <div className="mt-7 fe-frame fe-ticks" style={{ aspectRatio: "5/4", borderRadius: "var(--fe-r-lg)" }}>
                  <img src={teamImg} alt="Installation team fixing mounting rails" loading="lazy" />
                  <div className="fe-chip-caption">{isRtl ? "فريق التركيب على الموقع" : "On-site installation crew"}</div>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-6 space-y-3">
                  {c.turnkey.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: "#FFF8EC", border: "1px solid rgba(245,166,35,0.32)" }}>
                      <CheckCircle2 size={19} style={{ color: "var(--fe-amber-deep)", marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div className="fe-display" style={{ fontSize: "0.98rem", fontWeight: 600, color: "var(--fe-navy)" }}>{h.t}</div>
                        <p className="mt-1" style={{ color: "var(--fe-slate)", fontSize: "0.88rem", lineHeight: 1.5 }}>{h.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.25}><div className="mt-6"><SectionCTA locale={locale} label={c.turnkey.cta} /></div></Reveal>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute top-2 bottom-2 w-px" style={{ insetInlineStart: 23, background: "linear-gradient(180deg, var(--fe-amber), var(--fe-line) 90%)" }} />
              {c.turnkey.steps.map((s, i) => {
                const Icon = stepIcons[i];
                return (
                  <Reveal key={i} delay={i * 0.08}>
                    <div className="relative flex gap-6 pb-10 last:pb-0">
                      <div className="grid place-items-center rounded-full shrink-0 relative z-10" style={{ width: 48, height: 48, background: "var(--fe-navy)", color: "var(--fe-amber)", border: "4px solid var(--fe-white)" }}>
                        <Icon size={20} />
                      </div>
                      <div className="pt-1">
                        <div className="fe-mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--fe-steel-2)" }}>{isRtl ? "خطوة" : "Step"} 0{i + 1}</div>
                        <h3 className="fe-display mt-1.5" style={{ fontSize: "1.22rem", fontWeight: 600, color: "var(--fe-navy)" }}>{s.t}</h3>
                        <p className="mt-2" style={{ color: "var(--fe-slate)", lineHeight: 1.62 }}>{s.d}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 02 — Lifetime support (monitoring) ============ */}
      <section className="fe-section relative overflow-hidden fe-blueprint-dark" style={{ background: "var(--fe-grad-dark)", color: "white" }}>
        <div className="fe-glow-steel" />
        <div className="fe-container relative">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
            <div>
              <Reveal><div className="flex items-baseline gap-4"><span className="fe-index" style={{ fontSize: "1.4rem", color: "var(--fe-steel)" }}>{c.support.no}</span><div className="fe-eyebrow no-tick" style={{ color: "var(--fe-amber)" }}>{isRtl ? "الدعم مدى الحياة" : "Lifetime Support"}</div></div></Reveal>
              <Reveal delay={0.1}><h2 className="fe-display fe-h2 mt-4" style={{ fontWeight: 600, color: "white" }}>{c.support.headline}</h2></Reveal>

              <div className="mt-9 grid sm:grid-cols-2 gap-x-8 gap-y-1">
                {c.support.capabilities.map((cap, i) => {
                  const Icon = capIcons[i];
                  return (
                    <Reveal key={i} delay={i * 0.07}>
                      <div className="flex gap-4 py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                        <Icon size={22} style={{ color: "var(--fe-amber)", flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <h3 className="fe-display" style={{ fontSize: "1.03rem", fontWeight: 600, color: "white" }}>{cap.t}</h3>
                          <p className="mt-1.5" style={{ color: "rgba(255,255,255,0.66)", fontSize: "0.9rem", lineHeight: 1.55 }}>{cap.d}</p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
              <Reveal delay={0.2}><div className="mt-8"><SectionCTA locale={locale} label={c.support.cta} /></div></Reveal>
            </div>

            {/* Live monitoring panel */}
            <Reveal delay={0.15}>
              <MonitorPanel isRtl={isRtl} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 03 — Purchasing models (financial comparison) ============ */}
      <section className="fe-section" style={{ background: "var(--fe-cloud)" }}>
        <div className="fe-container">
          <div className="max-w-2xl">
            <Reveal><div className="flex items-baseline gap-4"><span className="fe-index" style={{ fontSize: "1.4rem" }}>{c.purchasing.no}</span><div className="fe-eyebrow no-tick">{isRtl ? "نماذج الشراء" : "Purchasing Models"}</div></div></Reveal>
            <Reveal delay={0.1}><h2 className="fe-display fe-h2 mt-4" style={{ fontWeight: 600 }}>{c.purchasing.headline}</h2></Reveal>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {c.purchasing.models.map((m, i) => {
              const Icon = i === 0 ? Wallet : Sparkles;
              const feature = i === 1;
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`h-full rounded-3xl p-8 md:p-10 relative overflow-hidden ${feature ? "fe-blueprint-dark" : ""}`} style={{
                    background: feature ? "var(--fe-grad-dark)" : "white",
                    color: feature ? "white" : "var(--fe-navy)",
                    border: `1px solid ${feature ? "rgba(143,180,214,0.16)" : "var(--fe-line)"}`,
                  }}>
                    {feature && <div className="fe-glow-sky" />}
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <div className="grid place-items-center rounded-xl" style={{ width: 52, height: 52, background: feature ? "rgba(245,166,35,0.16)" : "var(--fe-cloud)", color: "var(--fe-amber-deep)" }}>
                          <Icon size={24} />
                        </div>
                        <span className="fe-mono" style={{ fontSize: 11, padding: "6px 12px", borderRadius: 999, background: feature ? "rgba(245,166,35,0.16)" : "var(--fe-cloud)", color: feature ? "var(--fe-amber)" : "var(--fe-steel-deep)", border: feature ? "1px solid rgba(245,166,35,0.3)" : "1px solid var(--fe-line)", letterSpacing: "0.04em" }}>{m.tag}</span>
                      </div>
                      <h3 className="fe-display mt-6" style={{ fontSize: "1.5rem", fontWeight: 600, color: feature ? "white" : "var(--fe-navy)" }}>{m.t}</h3>
                      <p className="mt-4" style={{ color: feature ? "rgba(255,255,255,0.74)" : "var(--fe-slate)", lineHeight: 1.65 }}>{m.d}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal delay={0.15}><div className="mt-10"><SectionCTA locale={locale} label={c.purchasing.cta} /></div></Reveal>
        </div>
      </section>

      <CTARibbon locale={locale} title={home[locale].ribbonTitle} sub={home[locale].ribbonSub} cta={home[locale].ribbonCta} />
    </SiteLayout>
  );
}

/** Stylised 24/7 monitoring dashboard panel (illustrative). */
function MonitorPanel({ isRtl }: { isRtl: boolean }) {
  const bars = [42, 55, 48, 63, 70, 66, 78, 72, 84, 80, 90, 86];
  return (
    <div className="rounded-3xl p-6 fe-ticks" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(143,180,214,0.18)" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span style={{ width: 9, height: 9, borderRadius: 999, background: "var(--fe-green)", boxShadow: "0 0 0 3px rgba(23,151,106,0.25)" }} />
          <span className="fe-mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fe-steel)" }}>{isRtl ? "مراقبة حية" : "Live Monitoring"}</span>
        </div>
        <span className="fe-mono" style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>24 / 7</span>
      </div>
      {/* yield chart */}
      <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(10,27,46,0.5)", border: "1px solid rgba(143,180,214,0.12)" }}>
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="fe-display" style={{ fontSize: "1.6rem", fontWeight: 600, color: "white" }}>1,702 <span className="fe-mono" style={{ fontSize: 12, color: "var(--fe-steel)" }}>kWp</span></div>
            <div className="fe-mono" style={{ fontSize: 10.5, color: "var(--fe-slate-2)" }}>{isRtl ? "الإنتاج الفعلي مقابل المتوقع" : "Actual vs predicted yield"}</div>
          </div>
          <div className="fe-mono" style={{ fontSize: 12, color: "var(--fe-green)" }}>+2.4%</div>
        </div>
        <div className="flex items-end gap-1.5" style={{ height: 60 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 3, background: i > 8 ? "var(--fe-grad-sun)" : "rgba(143,180,214,0.4)" }} />
          ))}
        </div>
      </div>
      {/* status rows */}
      <div className="space-y-2.5">
        {[
          { l: isRtl ? "أداء العواكس" : "Inverter performance", v: "99.1%" },
          { l: isRtl ? "حالة السلاسل" : "String status", v: isRtl ? "الكل يعمل" : "All active" },
          { l: isRtl ? "زمن التشغيل" : "System uptime", v: "99.98%" },
        ].map((r, i) => (
          <div key={i} className="flex items-center justify-between py-2" style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.66)" }}>{r.l}</span>
            <span className="fe-mono" style={{ fontSize: 12.5, color: "var(--fe-amber)" }}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
