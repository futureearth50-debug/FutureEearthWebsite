/* eslint-disable prettier/prettier */
import { ArrowRight, ArrowDown, Building2, LandPlot, Network, BatteryCharging, Landmark, TrendingUp, BadgeCheck, ShieldCheck, Workflow } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { home, ui, type Locale } from "@/content/site";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal, SplitHeadline } from "@/components/site/Reveal";
import { LogoWall } from "@/components/site/LogoWall";
import { CTARibbon } from "@/components/site/Sections";
import { HomeServices, HomeContactCTA } from "@/components/site/HomeSections";
import { getLenis } from "@/lib/motion";

import heroImg from "@/assets/projects/rooftop-array-complex.webp";
import heroShowcaseImg from "@/assets/projects/ground-mount-desert.webp";
import villageImg from "@/assets/projects/village-mall.jpeg";
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
      {/* Centred at every width. Top padding clears the fixed 78px header; the
          matching bottom padding keeps the stack optically centred on mobile
          instead of pinning it up and pooling the slack underneath. */}
      <section
        className="relative overflow-hidden fe-blueprint-dark flex items-center min-h-[100svh] pt-28 pb-20 lg:pt-36 lg:pb-12"
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
              <SplitHeadline
                text={c.heroTitle}
                className="fe-display"
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

            {/* Right — live solar installation */}
            <Reveal delay={0.55}>
              <div className="relative">
                <div
                  className="absolute rounded-full"
                  style={{
                    inset: "8%",
                    background: "radial-gradient(closest-side, rgba(245,166,35,0.22), transparent 72%)",
                    filter: "blur(34px)",
                  }}
                />
                {/* Landscape on stacked layouts, portrait once it sits beside the headline */}
                <div
                  className="fe-frame fe-frame-zoom relative aspect-[16/10] lg:aspect-[4/5]"
                  style={{
                    borderRadius: "var(--fe-r-lg)",
                    border: "1px solid rgba(143,180,214,0.18)",
                    boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
                  }}
                >
                  <img src={heroShowcaseImg} alt="Future Earth engineers commissioning a ground-mounted solar array" />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(10,27,46,0) 50%, rgba(10,27,46,0.5) 100%)" }}
                  />
                </div>
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
                <h2 className="fe-display fe-h2 mt-4" style={{ fontWeight: 600, maxWidth: "16ch" }}>{c.sectorsTitle}</h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="fe-lead mt-6" style={{ maxWidth: 460 }}>{c.sectorsLead}</p>
              </Reveal>
            </div>

            <div>
              {c.sectors.map((s, i) => {
                const Icon = sectorIcons[i];
                return (
                  <Reveal key={i} delay={i * 0.06}>
                    <Link to={links[i] as string} className="group flex items-center gap-5 md:gap-7 py-6 border-t transition-colors" style={{ borderColor: "var(--fe-line)" }}>
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
              <p className="lg:pb-2" style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, fontSize: "1.03rem", maxWidth: 560 }}>{c.trackLead}</p>
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

      {/* ==================== OUR SERVICES ==================== */}
      <HomeServices locale={locale} />

      {/* Trusted-by logo wall */}
      <LogoWall locale={locale} />

      {/* ==================== CONTACT CTA (compact) ==================== */}
      <HomeContactCTA locale={locale} />

      {/* Conversion ribbon */}
      <CTARibbon locale={locale} title={c.ribbonTitle} sub={c.ribbonSub} cta={c.ribbonCta} />
    </SiteLayout>
  );
}

function ProjectTile({ p, img, large = false }: { p: { capacity: string; title: string; body: string }; img: string; large?: boolean }) {
  return (
    <div className="fe-frame fe-frame-zoom group relative h-full" style={{ minHeight: large ? 420 : 240, borderRadius: "var(--fe-r-lg)", border: "1px solid rgba(143,180,214,0.15)" }}>
      <img src={img} alt={p.title} loading="lazy" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,27,46,0.15) 0%, rgba(10,27,46,0.55) 45%, rgba(10,27,46,0.93) 100%)" }} />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <div className="fe-display" style={{ fontSize: large ? "clamp(2.6rem,5vw,3.6rem)" : "2rem", fontWeight: 600, letterSpacing: "-0.03em", color: "white", lineHeight: 1 }}>{p.capacity}</div>
        <h3 className="fe-display mt-2.5" style={{ fontSize: large ? "1.5rem" : "1.2rem", fontWeight: 600, color: "white" }}>{p.title}</h3>
        <p className="mt-2" style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem", lineHeight: 1.55, maxWidth: 440 }}>{p.body}</p>
      </div>
    </div>
  );
}
