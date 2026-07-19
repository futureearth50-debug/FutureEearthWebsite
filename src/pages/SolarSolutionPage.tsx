import { Link } from "@tanstack/react-router";
import { ArrowRight, Sun, Diamond, Cpu, Zap, BatteryCharging } from "lucide-react";
import { solar, home, type Locale } from "@/content/site";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { PageHero, SectionCTA, CTARibbon } from "@/components/site/Sections";

// Real project photography
import rooftopComplex from "@/assets/projects/rooftop-array-complex.webp";
import groundDesert from "@/assets/projects/ground-mount-desert.webp";
import substationGrid from "@/assets/projects/solar-substation-grid.webp";

// Solution imagery + technical diagrams (from Future Earth's own archive)
import rooftopAerial from "@/assets/solutions/rooftop-aerial-array.png";
import rooftopCorrugated from "@/assets/solutions/rooftop-corrugated-install.png";
import rooftopConcrete from "@/assets/solutions/rooftop-concrete-mounting.png";
import groundEngineers from "@/assets/solutions/ground-engineers-inspection.png";
import groundDesertFarm from "@/assets/solutions/ground-desert-farm-array.png";
import groundCarPark from "@/assets/solutions/ground-car-park-shades.png";
import groundComms from "@/assets/solutions/ground-comms-site.png";
import hybridFourSource from "@/assets/solutions/hybrid-four-source-diagram.png";
import hybridOffGrid from "@/assets/solutions/hybrid-off-grid-site.png";
import hybridDiesel from "@/assets/solutions/hybrid-diesel-generator.png";
import hybridGridArray from "@/assets/solutions/hybrid-grid-connected-array.png";
import hybridMicrogrid from "@/assets/solutions/hybrid-microgrid-controller.png";

export type SolutionSlug = "rooftop-solar" | "ground-base-solar" | "hybrid-solutions";

type Assets = {
  hero: string;
  icon: typeof Sun;
  feature: string;
  featureKind: "photo" | "diagram";
  pillars: string[];
  diagram?: string;
};

const ASSETS: Record<SolutionSlug, Assets> = {
  "rooftop-solar": {
    hero: rooftopComplex,
    icon: Sun,
    feature: rooftopAerial,
    featureKind: "photo",
    pillars: [rooftopCorrugated, rooftopConcrete],
  },
  "ground-base-solar": {
    hero: groundDesert,
    icon: Diamond,
    feature: groundEngineers,
    featureKind: "photo",
    pillars: [groundDesertFarm, groundCarPark, groundComms],
  },
  "hybrid-solutions": {
    hero: substationGrid,
    icon: Cpu,
    feature: hybridFourSource,
    featureKind: "diagram",
    pillars: [hybridOffGrid, hybridDiesel, hybridGridArray, hybridMicrogrid],
    diagram: hybridMicrogrid,
  },
};

const sourceIcons = [Sun, Diamond, BatteryCharging, Zap];

export function SolarSolutionPage({ locale, slug }: { locale: Locale; slug: SolutionSlug }) {
  const c = solar[locale];
  const isRtl = locale === "ar";
  const base = isRtl ? "/ar/solar-solutions" : "/solar-solutions";

  const part = c.parts.find((p) => p.slug === slug)!;
  const a = ASSETS[slug];
  const Icon = a.icon;
  const isHybrid = slug === "hybrid-solutions";

  return (
    <SiteLayout locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={c.eyebrow}
        title={part.headline}
        lead={part.subhead}
        image={a.hero}
        imageAlt={part.headline}
      />

      {/* ============ Sibling solution switcher ============ */}
      <section style={{ background: "var(--fe-white)", borderBottom: "1px solid var(--fe-line)" }}>
        <div className="fe-container">
          <div className="fe-solnav">
            {c.parts.map((p) => {
              const active = p.slug === slug;
              return (
                <Link
                  key={p.slug}
                  to={`${base}/${p.slug}` as string}
                  className={`fe-solnav-item ${active ? "is-active" : ""}`}
                >
                  <span className="fe-index" style={{ fontSize: "0.78rem" }}>{p.no}</span>
                  <span className="fe-solnav-label fe-display">{p.navLabel}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ Feature band ============ */}
      <section className="fe-section">
        <div className="fe-container">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
            <Reveal>
              {a.featureKind === "diagram" ? (
                <div className="rounded-3xl bg-white p-6 md:p-10" style={{ border: "1px solid var(--fe-line)", boxShadow: "var(--fe-shadow-md)" }}>
                  <img src={a.feature} alt={part.headline} className="w-full" style={{ display: "block" }} loading="lazy" />
                </div>
              ) : (
                <div className="fe-frame fe-frame-zoom fe-ticks" style={{ aspectRatio: "4/3", borderRadius: "var(--fe-r-lg)" }}>
                  <img src={a.feature} alt={part.headline} loading="lazy" />
                  <div className="fe-chip-caption">
                    {isRtl ? "مشروع منفَّذ · فيوتشر إيرث" : "Delivered project · Future Earth"}
                  </div>
                </div>
              )}
            </Reveal>

            <div>
              <Reveal>
                <div className="flex items-baseline gap-4">
                  <span className="fe-index" style={{ fontSize: "1.4rem" }}>{part.no}</span>
                  <div className="grid place-items-center rounded-xl" style={{ width: 48, height: 48, background: "var(--fe-grad-sun)", color: "#221200" }}>
                    <Icon size={22} />
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="fe-display fe-h2 mt-5" style={{ fontWeight: 600 }}>{part.headline}</h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="fe-lead mt-5">{part.subhead}</p>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8"><SectionCTA locale={locale} label={part.cta} /></div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Technical pillars — alternating image + text ============ */}
      <section className="fe-section" style={{ background: "var(--fe-cloud)" }}>
        <div className="fe-container">
          <Reveal>
            <div className="fe-eyebrow">{isRtl ? "ركائز البنية التحتية الفنية" : "Technical Infrastructure Pillars"}</div>
          </Reveal>

          <div className="mt-12 space-y-14 lg:space-y-20">
            {part.pillars.map((p, j) => {
              const flip = j % 2 === 1;
              return (
                <div key={j} className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
                  <Reveal className={flip ? "lg:order-2" : ""}>
                    <div className="fe-frame fe-frame-zoom" style={{ aspectRatio: "3/2", borderRadius: "var(--fe-r-lg)" }}>
                      <img src={a.pillars[j]} alt={p.t} loading="lazy" />
                    </div>
                  </Reveal>
                  <div className={flip ? "lg:order-1" : ""}>
                    <Reveal delay={0.08}>
                      <span className="fe-index" style={{ fontSize: "1.1rem" }}>0{j + 1}</span>
                      <h3 className="fe-display mt-3" style={{ fontSize: "clamp(1.3rem,2vw,1.75rem)", fontWeight: 600, color: "var(--fe-navy)" }}>
                        {p.t}
                      </h3>
                      <p className="fe-lead mt-4">{p.d}</p>
                    </Reveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ Hybrid only — SCADA integration ============ */}
      {isHybrid && (
        <section className="fe-section relative overflow-hidden fe-blueprint-dark" style={{ background: "var(--fe-grad-dark)", color: "white" }}>
          <div className="fe-glow-steel" />
          <div className="fe-container relative">
            <div className="max-w-3xl">
              <Reveal><div className="fe-eyebrow">{isRtl ? "التحكم والإشراف" : "Command & Control"}</div></Reveal>
              <Reveal delay={0.1}>
                <h2 className="fe-display fe-h2 mt-4" style={{ fontWeight: 600, color: "white" }}>{c.scadaTitle}</h2>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="fe-lead mt-4" style={{ color: "rgba(255,255,255,0.76)" }}>{c.scadaSub}</p>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <div className="mt-12 rounded-3xl p-6 md:p-10 fe-ticks" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(143,180,214,0.16)" }}>
                <div className="grid lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 lg:gap-4 items-center">
                  <div className="grid grid-cols-2 gap-3">
                    {c.scadaSources.map((s, i) => {
                      const SIcon = sourceIcons[i];
                      return (
                        <div key={i} className="rounded-2xl p-4 flex flex-col items-center gap-2 text-center" style={{ background: "rgba(143,180,214,0.08)", border: "1px solid rgba(143,180,214,0.16)" }}>
                          <SIcon size={22} style={{ color: "var(--fe-amber)" }} />
                          <span className="fe-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>{s}</span>
                        </div>
                      );
                    })}
                  </div>
                  <ScadaArrow />
                  <div className="rounded-2xl p-6 text-center relative overflow-hidden" style={{ background: "var(--fe-grad-steel)", border: "1px solid rgba(143,180,214,0.3)" }}>
                    <div className="fe-glow-sky" />
                    <div className="relative">
                      <div className="grid place-items-center rounded-full mx-auto mb-3" style={{ width: 52, height: 52, background: "rgba(245,166,35,0.16)", border: "1px solid rgba(245,166,35,0.35)" }}>
                        <Cpu size={24} style={{ color: "var(--fe-amber)" }} />
                      </div>
                      <div className="fe-display" style={{ fontWeight: 600, fontSize: "1rem", color: "white", lineHeight: 1.25 }}>{c.scadaHub}</div>
                    </div>
                  </div>
                  <ScadaArrow />
                  <div className="rounded-2xl p-6 text-center h-full flex flex-col justify-center" style={{ background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)" }}>
                    <div className="fe-display" style={{ fontWeight: 600, fontSize: "1.15rem", color: "var(--fe-amber)" }}>{c.scadaOut}</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Microgrid controller architecture */}
            {a.diagram && (
              <Reveal delay={0.15}>
                <div className="mt-6 rounded-3xl bg-white p-6 md:p-10" style={{ border: "1px solid rgba(143,180,214,0.2)" }}>
                  <img src={a.diagram} alt="Advanced microgrid controller architecture" className="w-full" style={{ display: "block" }} loading="lazy" />
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ============ Explore the other solutions ============ */}
      <section className="fe-section">
        <div className="fe-container">
          <Reveal>
            <div className="fe-eyebrow">{isRtl ? "استكشف المزيد" : "Explore more"}</div>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {c.parts.filter((p) => p.slug !== slug).map((p) => (
              <Reveal key={p.slug}>
                <Link to={`${base}/${p.slug}` as string} className="fe-card group block h-full">
                  <span className="fe-index" style={{ fontSize: "0.9rem" }}>{p.no}</span>
                  <h3 className="fe-display mt-3" style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--fe-navy)" }}>{p.navLabel}</h3>
                  <p className="mt-2.5" style={{ color: "var(--fe-slate)", lineHeight: 1.6 }}>{p.short}</p>
                  <span className="fe-link mt-5" style={{ color: "var(--fe-amber-deep)", fontWeight: 600 }}>
                    {isRtl ? "عرض الحل" : "View solution"}
                    <ArrowRight size={16} className="fe-flip-x transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTARibbon locale={locale} title={home[locale].ribbonTitle} sub={home[locale].ribbonSub} cta={home[locale].ribbonCta} />
    </SiteLayout>
  );
}

function ScadaArrow() {
  return (
    <div className="flex lg:flex-col items-center justify-center py-2 lg:py-0">
      <div className="hidden lg:flex items-center" style={{ color: "var(--fe-steel)" }}>
        <div style={{ width: 28, height: 2, background: "linear-gradient(90deg, transparent, var(--fe-steel))" }} />
        <ArrowRight size={18} className="fe-flip-x" />
      </div>
      <div className="lg:hidden" style={{ color: "var(--fe-steel)", transform: "rotate(90deg)" }}>
        <ArrowRight size={20} />
      </div>
    </div>
  );
}
