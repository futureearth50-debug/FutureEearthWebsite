/* eslint-disable prettier/prettier */
import { ArrowRight, ArrowDown, Building2, LandPlot, Network, BatteryCharging, Landmark, TrendingUp, BadgeCheck, ShieldCheck, Workflow } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { home, ui, type Locale } from "@/content/site";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal, SplitHeadline } from "@/components/site/Reveal";
import { StatCounter } from "@/components/site/StatCounter";
import { LogoWall } from "@/components/site/LogoWall";
import { CTARibbon } from "@/components/site/Sections";
import { getLenis } from "@/lib/motion";

import monogram from "@/assets/brand/future-earth-monogram.png";
import heroImg from "@/assets/projects/rooftop-array-complex.webp";
import villageImg from "@/assets/projects/rooftop-array-inspection.webp";
import munajemImg from "@/assets/projects/rooftop-panel-install.webp";
import dewaImg from "@/assets/projects/solar-substation-grid.webp";
import railImg from "@/assets/projects/rooftop-rail-sealing.webp";

const sectorIcons = [Building2, LandPlot, Network, BatteryCharging, Landmark];
const sectorLinks = (isRtl: boolean) => [
  isRtl ? "/ar/solar-solutions" : "/solar-solutions",
  isRtl ? "/ar/solar-solutions" : "/solar-solutions",
  isRtl ? "/ar/solar-solutions" : "/solar-solutions",
  isRtl ? "/ar/products" : "/products",
  isRtl ? "/ar/services" : "/services",
];
const featureIcons = [TrendingUp, BadgeCheck, ShieldCheck, Workflow];
const projectImgs = [villageImg, munajemImg, dewaImg];

function scrollToTrack(e: React.MouseEvent) {
  e.preventDefault();
  const el = document.getElementById("track-record");
  const lenis = getLenis();
  if (lenis && el) lenis.scrollTo(el, { offset: -20 });
  else el?.scrollIntoView({ behavior: "smooth" });
}

export function HomePage({ locale }: { locale: Locale }) {
  const c = home[locale];
  const t = ui[locale];
  const isRtl = locale === "ar";
  const links = sectorLinks(isRtl);

  return (
    <SiteLayout locale={locale}>
      {/* ============================ HERO ============================ */}
      <section
        className="relative overflow-hidden fe-blueprint-dark flex items-start lg:items-center min-h-[100svh] pt-24 pb-10 lg:pt-36 lg:pb-12"
        style={{ background: "var(--fe-navy)", color: "white" }}
      >
        <div className="absolute inset-0">
          <img src={heroImg} alt="Utility-scale rooftop solar array over a Riyadh industrial complex" className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(10,27,46,0.94) 0%, rgba(10,27,46,0.78) 42%, rgba(10,27,46,0.42) 100%)" }} />
          <div className="fe-glow-sky" />
        </div>

        <div className="fe-container relative w-full">
          <div className="grid lg:grid-cols-[1.55fr_1fr] gap-12 lg:gap-16 items-center">
            {/* Left — headline */}
            <div>
              <Reveal><div className="fe-eyebrow" style={{ color: "var(--fe-amber)" }}>{c.eyebrow}</div></Reveal>
              <SplitHeadline
                text={c.heroTitle}
                className="fe-display mt-6"
                style={{ fontSize: "clamp(2.15rem,4.7vw,4.15rem)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05, maxWidth: "17ch" }}
              />
              <Reveal delay={0.35}>
                <p className="mt-7" style={{ color: "rgba(255,255,255,0.74)", maxWidth: 620, fontSize: "1.03rem", lineHeight: 1.72 }}>{c.heroSub}</p>
              </Reveal>
              <Reveal delay={0.5}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link to={isRtl ? "/ar/contact" : "/contact"} className="fe-btn fe-btn-primary">
                    {c.ctaPrimary} <ArrowRight size={17} className="fe-flip-x" />
                  </Link>
                  <a href="#track-record" onClick={scrollToTrack} className="fe-btn fe-btn-ghost">
                    {c.ctaSecondary}
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right — brand mark */}
            <Reveal delay={0.55}>
              <div className="relative flex items-center justify-center" style={{ padding: "clamp(1rem,4vw,3rem)" }}>
                <div
                  className="absolute rounded-full"
                  style={{
                    inset: "10%",
                    background: "radial-gradient(closest-side, rgba(245,166,35,0.20), transparent 72%)",
                    filter: "blur(28px)",
                  }}
                />
                <img
                  src={monogram}
                  alt="Future Earth Energy Systems"
                  width={256}
                  height={256}
                  className="relative"
                  style={{
                    width: "clamp(220px,36vw,420px)",
                    height: "auto",
                    filter: "drop-shadow(0 24px 50px rgba(0,0,0,0.4))",
                  }}
                />
              </div>
            </Reveal>
          </div>
        </div>

        <a href="#track-record" onClick={scrollToTrack} className="absolute bottom-7 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2" style={{ color: "rgba(255,255,255,0.5)" }}>
          <span className="fe-mono" style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>{t.scroll}</span>
          <ArrowDown size={16} className="animate-bounce" />
        </a>
      </section>

      {/* ==================== QUICK SECTOR ACCESS ==================== */}
      <section className="fe-section">
        <div className="fe-container">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-20 items-start">
            <div className="lg:sticky lg:top-32">
              <Reveal><div className="fe-eyebrow">{c.sectorsEyebrow}</div></Reveal>
              <Reveal delay={0.1}>
                <h2 className="fe-display fe-h2 mt-4" style={{ fontWeight: 600, maxWidth: "12ch" }}>{c.sectorsTitle}</h2>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8 fe-mono" style={{ fontSize: 12, letterSpacing: "0.14em", color: "var(--fe-slate-2)", textTransform: "uppercase" }}>
                  05 {isRtl ? "قطاعات هندسية" : "Engineering Sectors"}
                </div>
              </Reveal>
            </div>

            <div>
              {c.sectors.map((s, i) => {
                const Icon = sectorIcons[i];
                return (
                  <Reveal key={i} delay={i * 0.06}>
                    <Link to={links[i] as string} className="group flex items-center gap-5 md:gap-7 py-6 border-t transition-colors" style={{ borderColor: "var(--fe-line)" }}>
                      <span className="fe-index" style={{ fontSize: "0.95rem", minWidth: 34 }}>0{i + 1}</span>
                      <span className="grid place-items-center rounded-xl transition-all duration-500 group-hover:scale-105" style={{ width: 52, height: 52, background: "var(--fe-cloud)", color: "var(--fe-navy)", flexShrink: 0 }}>
                        <Icon size={23} />
                      </span>
                      <span className="fe-display flex-1" style={{ fontSize: "clamp(1.15rem,2vw,1.6rem)", fontWeight: 600, color: "var(--fe-navy)", lineHeight: 1.2 }}>{s}</span>
                      <span className="grid place-items-center rounded-full transition-all duration-500 opacity-40 group-hover:opacity-100 group-hover:bg-[var(--fe-amber)] group-hover:text-[#221200]" style={{ width: 40, height: 40, color: "var(--fe-navy)", flexShrink: 0 }}>
                        <ArrowRight size={18} className="fe-flip-x" />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
              <div style={{ borderTop: "1px solid var(--fe-line)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== VERIFIED TRACK RECORD ==================== */}
      <section id="track-record" className="relative overflow-hidden fe-blueprint-dark fe-section" style={{ background: "var(--fe-grad-dark)", color: "white" }}>
        <div className="fe-glow-steel" />
        <div className="fe-container relative">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-end mb-14">
            <div>
              <Reveal><div className="fe-eyebrow" style={{ color: "var(--fe-amber)" }}>{c.trackEyebrow}</div></Reveal>
              <Reveal delay={0.1}>
                <h2 className="fe-display mt-5" style={{ fontSize: "clamp(1.9rem,3.6vw,3.1rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, maxWidth: "16ch" }}>{c.trackTitle}</h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <div className="lg:pb-2">
                <div className="flex items-end gap-3">
                  <div className="fe-display" style={{ fontSize: "clamp(3.5rem,8vw,6rem)", fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 0.9, color: "var(--fe-amber)" }}>
                    <StatCounter value={c.trackLeadValue} suffix="+" unit="" label="" tone="light" bare />
                  </div>
                  <div className="fe-mono pb-2" style={{ fontSize: 14, color: "var(--fe-steel)" }}>MW</div>
                </div>
                <div className="fe-mono mt-1" style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fe-steel-2)" }}>{c.trackLeadLabel}</div>
                <p className="mt-4" style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.65, maxWidth: 460 }}>{c.trackLeadBody}</p>
              </div>
            </Reveal>
          </div>

          {/* Project bento — flagship + two */}
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Flagship */}
            <Reveal className="lg:row-span-2">
              <ProjectTile p={c.projects[0]} img={projectImgs[0]} large />
            </Reveal>
            <Reveal delay={0.1}><ProjectTile p={c.projects[1]} img={projectImgs[1]} /></Reveal>
            <Reveal delay={0.18}><ProjectTile p={c.projects[2]} img={projectImgs[2]} /></Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link to={isRtl ? "/ar/contact" : "/contact"} className="fe-btn fe-btn-primary">
                {c.trackCta} <ArrowRight size={17} className="fe-flip-x" />
              </Link>
              <Link to={isRtl ? "/ar/solar-solutions" : "/solar-solutions"} className="fe-link" style={{ color: "var(--fe-steel)" }}>
                {isRtl ? "استكشف حلولنا الهندسية" : "Explore our engineering solutions"} <ArrowRight size={16} className="fe-flip-x" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==================== VALUE & CERTIFICATIONS ==================== */}
      <section className="fe-section" style={{ background: "var(--fe-paper)" }}>
        <div className="fe-container">
          <div className="max-w-3xl">
            <Reveal><div className="fe-eyebrow">{c.valueEyebrow}</div></Reveal>
            <Reveal delay={0.1}><h2 className="fe-display fe-h2 mt-4" style={{ fontWeight: 600 }}>{c.valueTitle}</h2></Reveal>
          </div>

          {/* Spec-sheet matrix */}
          <div className="mt-14 grid sm:grid-cols-2 border-t border-l" style={{ borderColor: "var(--fe-line)" }}>
            {c.features.map((f, i) => {
              const Icon = featureIcons[i];
              return (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="relative h-full p-8 md:p-10 border-b border-r transition-colors group hover:bg-white" style={{ borderColor: "var(--fe-line)" }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="fe-display" style={{ fontSize: "clamp(2.4rem,4vw,3.4rem)", fontWeight: 600, letterSpacing: "-0.03em", color: "var(--fe-navy)", lineHeight: 1 }}>{f.metric}</div>
                      <div className="grid place-items-center rounded-xl transition-colors" style={{ width: 46, height: 46, background: "var(--fe-cloud)", color: "var(--fe-amber-deep)" }}>
                        <Icon size={22} />
                      </div>
                    </div>
                    <div className="fe-mono mt-3" style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fe-steel-2)" }}>{f.metricLabel}</div>
                    <h3 className="fe-display mt-6" style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--fe-navy)" }}>{f.t}</h3>
                    <p className="mt-2.5" style={{ color: "var(--fe-slate)", lineHeight: 1.62, fontSize: "0.95rem" }}>{f.d}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trusted-by logo wall */}
      <LogoWall locale={locale} />

      {/* Conversion ribbon */}
      <CTARibbon locale={locale} title={c.ribbonTitle} sub={c.ribbonSub} cta={c.ribbonCta} />
    </SiteLayout>
  );
}

function ProjectTile({ p, img, large = false }: { p: { capacity: string; kwp: string; title: string; kicker: string; body: string }; img: string; large?: boolean }) {
  return (
    <div className="fe-frame fe-frame-zoom group relative h-full" style={{ minHeight: large ? 420 : 240, borderRadius: "var(--fe-r-lg)", border: "1px solid rgba(143,180,214,0.15)" }}>
      <img src={img} alt={p.title} loading="lazy" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,27,46,0.15) 0%, rgba(10,27,46,0.55) 45%, rgba(10,27,46,0.93) 100%)" }} />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="fe-mono" style={{ fontSize: 11, padding: "4px 9px", borderRadius: 999, background: "rgba(245,166,35,0.16)", color: "var(--fe-amber)", border: "1px solid rgba(245,166,35,0.3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{p.kicker}</span>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="fe-display" style={{ fontSize: large ? "clamp(2.6rem,5vw,3.6rem)" : "2rem", fontWeight: 600, letterSpacing: "-0.03em", color: "white", lineHeight: 1 }}>{p.capacity}</span>
          <span className="fe-mono" style={{ fontSize: 12, color: "var(--fe-steel)" }}>{p.kwp}</span>
        </div>
        <h3 className="fe-display mt-2.5" style={{ fontSize: large ? "1.5rem" : "1.2rem", fontWeight: 600, color: "white" }}>{p.title}</h3>
        <p className="mt-2" style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem", lineHeight: 1.55, maxWidth: 440 }}>{p.body}</p>
      </div>
    </div>
  );
}
