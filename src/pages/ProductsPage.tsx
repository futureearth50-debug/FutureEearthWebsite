import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Gauge, PlugZap, ShieldCheck, ExternalLink, PlayCircle, FileText, FileBox, Play } from "lucide-react";
import { products, home, type Locale } from "@/content/site";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { StatCounter } from "@/components/site/StatCounter";
import { PageHero, SectionCTA, CTARibbon } from "@/components/site/Sections";
import { ProductCatalogue } from "@/components/site/ProductCatalogue";
import { MediaModal, type Media } from "@/components/site/MediaModal";
import batteryImg from "@/assets/stock/battery-energy-storage.webp";
import applicationsImg from "@/assets/products/sav-applications.jpg";
import hospitalImg from "@/assets/products/sav-critical-loads-hospital.jpg";
import upsDiagram from "@/assets/products/sav-inline-ups-diagram.jpg";
import gridFailIcon from "@/assets/products/icon-grid-fail.svg";
import batteryIcon from "@/assets/products/icon-battery.svg";
import generatorIcon from "@/assets/products/icon-generator.svg";
import savLogo from "@/assets/logos/partners/sav.webp";
import huaweiLogo from "@/assets/logos/partners/huawei.webp";
import sungrowLogo from "@/assets/logos/partners/sungrow.webp";
import abbLogo from "@/assets/logos/partners/abb.webp";
import schneiderLogo from "@/assets/logos/partners/schneider-electric.webp";

const featureIcons = [Gauge, PlugZap, ShieldCheck];
const inverterLogos = [sungrowLogo, huaweiLogo, abbLogo, schneiderLogo];
const flowIcons = [gridFailIcon, batteryIcon, generatorIcon];
const kindIcons: Record<string, typeof FileText> = { link: ExternalLink, video: PlayCircle, pdf: FileText, doc: FileBox };
const FACTORY_VIDEO = "/media/sav-factory-tour.mp4";

export function ProductsPage({ locale }: { locale: Locale }) {
  const c = products[locale];
  const isRtl = locale === "ar";
  const contactTo = isRtl ? "/ar/contact" : "/contact";
  const [media, setMedia] = useState<Media | null>(null);

  return (
    <SiteLayout locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.aboutPartner}
        image={batteryImg}
        imageAlt="Industrial lithium battery energy storage system"
      />

      {/* ============ SAV partner: stats + factory video ============ */}
      <section className="relative overflow-hidden fe-blueprint-dark" style={{ background: "var(--fe-navy)", color: "white" }}>
        <div className="fe-container fe-section relative">
          <div className="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-16 items-center">
            {/* Left: partner + stats */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="fe-logo-cell" style={{ padding: 0, minWidth: 0, height: "auto" }}>
                  <img src={savLogo} alt="SAV" style={{ maxHeight: 38, filter: "brightness(0) invert(1)", opacity: 0.9 }} />
                </div>
                <div style={{ width: 1, height: 34, background: "rgba(143,180,214,0.25)" }} />
                <div className="fe-mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fe-steel-2)" }}>
                  {c.aboutPartnerLabel}
                </div>
              </div>
              <Reveal><h2 className="fe-display" style={{ fontSize: "clamp(1.5rem,2.4vw,2rem)", fontWeight: 600 }}>{c.factoryTitle}</h2></Reveal>
              <Reveal delay={0.1}><p className="fe-lead mt-4" style={{ color: "rgba(255,255,255,0.72)" }}>{c.factoryBody}</p></Reveal>

              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-9">
                {c.stats.map((s, i) => (
                  <div key={i}>
                    <StatCounter value={s.value} suffix={s.suffix} unit={s.unit} label={s.label} tone="light" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: factory video showcase */}
            <Reveal delay={0.1}>
              <div className="fe-videoshow" onClick={() => setMedia({ type: "video", src: FACTORY_VIDEO, title: c.factoryTitle })}>
                <video src={`${FACTORY_VIDEO}#t=1.2`} preload="metadata" muted playsInline />
                <div className="fe-videoshow-veil" />
                <div className="fe-videoshow-play"><Play size={30} style={{ marginInlineStart: 4 }} /></div>
                <div className="absolute inset-x-0 bottom-0 p-6 flex items-center gap-3">
                  <span className="fe-mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)" }}>
                    {c.factoryEyebrow}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ Product catalogue (categorized) ============ */}
      <ProductCatalogue locale={locale} />

      {/* ============ Applications ============ */}
      <section className="fe-section">
        <div className="fe-container">
          <div className="max-w-3xl">
            <Reveal><div className="fe-eyebrow">{isRtl ? "التطبيقات" : "Applications"}</div></Reveal>
            <Reveal delay={0.1}><h2 className="fe-display fe-h2 mt-4" style={{ fontWeight: 600, maxWidth: "20ch" }}>{c.appsTitle}</h2></Reveal>
          </div>

          {/* Application scenarios render */}
          <Reveal delay={0.1}>
            <div className="mt-12 rounded-3xl overflow-hidden" style={{ border: "1px solid var(--fe-line)", background: "linear-gradient(180deg,#fff,var(--fe-cloud))" }}>
              <img src={applicationsImg} alt="SAV energy storage applications: off-grid, commercial and industrial, emergency backup, EV charging" className="w-full" style={{ display: "block" }} loading="lazy" />
            </div>
          </Reveal>

          {/* Application cards — critical load features the hospital cutaway */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {c.apps.map((a, i) => (
              <Reveal key={i} delay={i * 0.08} className={i === 2 ? "lg:col-span-1" : ""}>
                <div className="fe-card h-full" style={{ padding: 0, overflow: "hidden" }}>
                  {i === 1 && (
                    <div className="fe-frame" style={{ aspectRatio: "16/9" }}>
                      <img src={hospitalImg} alt="Critical-load backup across a hospital facility" loading="lazy" />
                    </div>
                  )}
                  <div style={{ padding: "1.6rem" }}>
                    <div className="fe-mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--fe-steel-2)" }}>{String(i + 1).padStart(2, "0")}</div>
                    <h3 className="fe-display mt-2" style={{ fontSize: "1.12rem", fontWeight: 600, color: "var(--fe-navy)" }}>{a.t}</h3>
                    <p className="mt-2.5" style={{ color: "var(--fe-slate)", fontSize: "0.93rem", lineHeight: 1.6 }}>{a.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Spinning Reserve flow ============ */}
      <section className="fe-section" style={{ background: "var(--fe-cloud)" }}>
        <div className="fe-container">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
            <div>
              <Reveal><div className="fe-eyebrow">{isRtl ? "الاحتياطي الدوّار" : "Spinning Reserve"}</div></Reveal>
              <Reveal delay={0.1}><h2 className="fe-display fe-h3 mt-4" style={{ fontWeight: 600, maxWidth: "20ch" }}>{c.flowTitle}</h2></Reveal>

              {/* Flow with real SAV icons */}
              <Reveal delay={0.15}>
                <div className="mt-8 rounded-3xl p-6 md:p-8 relative overflow-hidden fe-blueprint-dark" style={{ background: "var(--fe-grad-dark)", color: "white" }}>
                  <div className="fe-glow-sky" />
                  <div className="relative grid gap-4">
                    {c.flow.map((step, i) => (
                      <div key={i} className="flex items-center gap-4 rounded-2xl p-4" style={{
                        background: i === 1 ? "rgba(245,166,35,0.12)" : "rgba(143,180,214,0.06)",
                        border: `1px solid ${i === 1 ? "rgba(245,166,35,0.35)" : "rgba(143,180,214,0.14)"}`,
                      }}>
                        <div className="grid place-items-center rounded-2xl shrink-0" style={{ width: 62, height: 62, background: i === 1 ? "rgba(245,166,35,0.14)" : "rgba(143,180,214,0.08)" }}>
                          <img src={flowIcons[i]} alt="" style={{ width: 34, height: 34, objectFit: "contain" }} />
                        </div>
                        <div>
                          <div className="fe-mono" style={{ fontSize: 10.5, letterSpacing: "0.1em", color: i === 1 ? "var(--fe-amber)" : "var(--fe-steel-2)" }}>{String(i + 1).padStart(2, "0")}</div>
                          <div className="fe-display mt-1" style={{ fontSize: "1rem", fontWeight: 600, color: i === 1 ? "var(--fe-amber)" : "white", lineHeight: 1.35 }}>{step}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.2}><div className="mt-8"><SectionCTA locale={locale} label={c.storageCta} /></div></Reveal>
            </div>

            {/* In-line UPS architecture diagram */}
            <Reveal delay={0.1}>
              <div className="rounded-3xl overflow-hidden bg-white p-4 md:p-6" style={{ border: "1px solid var(--fe-line)", boxShadow: "var(--fe-shadow-md)" }}>
                <img src={upsDiagram} alt="In-line UPS architecture: grid power, SAV cabinet, inverter and critical loads" className="w-full rounded-xl" style={{ display: "block" }} loading="lazy" />
                <div className="fe-mono mt-4 px-2 pb-1" style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--fe-slate-2)" }}>
                  {isRtl ? "بنية UPS المتصلة — نظام SAV يظل نشطاً دائماً" : "In-line UPS architecture — the SAV system is always active"}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ Inverters ============ */}
      <section className="fe-section">
        <div className="fe-container">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-28">
              <Reveal><div className="fe-eyebrow">{c.invertersEyebrow}</div></Reveal>
              <Reveal delay={0.1}><h2 className="fe-display fe-h2 mt-4" style={{ fontWeight: 600 }}>{c.invertersTitle}</h2></Reveal>
              <Reveal delay={0.15}><p className="fe-lead mt-5">{c.invertersOverview}</p></Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {inverterLogos.map((logo, i) => (
                    <div key={i} className="rounded-xl grid place-items-center p-4" style={{ background: "white", border: "1px solid var(--fe-line)", height: 66 }}>
                      <img src={logo} alt={c.invertersBrands[i]} style={{ maxHeight: 26, maxWidth: 96, objectFit: "contain" }} />
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.25}><div className="mt-8"><SectionCTA locale={locale} label={c.invertersCta} /></div></Reveal>
            </div>

            <div className="space-y-4">
              {c.invertersFeatures.map((f, i) => {
                const Icon = featureIcons[i];
                return (
                  <Reveal key={i} delay={i * 0.08}>
                    <div className="fe-card flex items-start gap-5" style={{ background: "white" }}>
                      <div className="fe-display shrink-0" style={{ fontSize: "1.9rem", fontWeight: 600, color: "var(--fe-amber-deep)", minWidth: 76, letterSpacing: "-0.02em" }}>{f.metric}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5">
                          <Icon size={18} style={{ color: "var(--fe-steel-deep)" }} />
                          <h3 className="fe-display" style={{ fontSize: "1.08rem", fontWeight: 600, color: "var(--fe-navy)" }}>{f.t}</h3>
                        </div>
                        <p className="mt-2" style={{ color: "var(--fe-slate)", fontSize: "0.93rem", lineHeight: 1.6 }}>{f.d}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ Download area ============ */}
      <section className="fe-section" style={{ background: "var(--fe-cloud)" }}>
        <div className="fe-container">
          <div className="max-w-2xl">
            <Reveal><div className="fe-eyebrow">{c.resourcesEyebrow}</div></Reveal>
            <Reveal delay={0.1}><h2 className="fe-display fe-h2 mt-4" style={{ fontWeight: 600 }}>{c.resourcesTitle}</h2></Reveal>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.resources.map((r, i) => {
              const Icon = kindIcons[r.kind] || FileText;
              const isExternalLink = r.kind === "link";
              const isVideo = r.kind === "video";
              const isDoc = r.kind === "pdf" || r.kind === "doc";
              const content = (
                <>
                  <div className="flex items-start justify-between">
                    <div className="grid place-items-center rounded-xl transition-colors group-hover:bg-[var(--fe-navy)] group-hover:text-white" style={{ width: 46, height: 46, background: "var(--fe-white)", color: "var(--fe-navy)", border: "1px solid var(--fe-line)" }}>
                      <Icon size={21} />
                    </div>
                    <ArrowRight size={18} className="fe-flip-x transition-transform group-hover:translate-x-1" style={{ color: "var(--fe-slate-2)" }} />
                  </div>
                  <h3 className="fe-display mt-5" style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--fe-navy)" }}>{r.t}</h3>
                  <div className="fe-mono mt-1.5" style={{ fontSize: 11.5, letterSpacing: "0.04em", color: "var(--fe-slate-2)" }}>{r.meta}</div>
                </>
              );
              const cls = "fe-card group block h-full text-start w-full";
              return (
                <Reveal key={i} delay={i * 0.05}>
                  {isVideo ? (
                    <button className={cls} onClick={() => setMedia({ type: "video", src: r.href, title: r.t })}>{content}</button>
                  ) : isExternalLink || isDoc ? (
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className={cls}>{content}</a>
                  ) : (
                    <Link to={contactTo} className={cls}>{content}</Link>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTARibbon locale={locale} title={home[locale].ribbonTitle} sub={home[locale].ribbonSub} cta={home[locale].ribbonCta} />

      <MediaModal media={media} onClose={() => setMedia(null)} locale={locale} />
    </SiteLayout>
  );
}
