import { Quote } from "lucide-react";
import { about, home, type Locale } from "@/content/site";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { PageHero, CTARibbon } from "@/components/site/Sections";
import { LogoWall } from "@/components/site/LogoWall";
import { Credentials } from "@/components/site/Credentials";
import chairmanImg from "@/assets/brand/chairman-portrait.webp";
import heroImg from "@/assets/projects/ground-mount-desert.webp";
import vision2030 from "@/assets/certificates/saudi-vision-2030.png";

export function AboutPage({ locale }: { locale: Locale }) {
  const c = about[locale];
  const isRtl = locale === "ar";

  return (
    <SiteLayout locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={c.eyebrow}
        title={c.title}
        image={heroImg}
        imageAlt="Future Earth engineers inspecting a ground-mounted solar array"
        caption={c.vision2030}
      />

      {/* ============ Executive message + Vision 2030 ============ */}
      <section className="fe-section">
        <div className="fe-container">
          <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-10 lg:gap-16 items-start">
            {/* Chairman portrait */}
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <div className="fe-frame fe-ticks" style={{ aspectRatio: "4/5", borderRadius: "var(--fe-r-lg)" }}>
                  <img src={chairmanImg} alt="Chairman of the Board, Future Earth Energy Systems" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 p-5" style={{ background: "linear-gradient(180deg, transparent, rgba(10,27,46,0.9))" }}>
                    <div className="fe-display" style={{ color: "white", fontWeight: 600, fontSize: "1.05rem" }}>{isRtl ? "رئيس مجلس الإدارة" : "Chairman of the Board"}</div>
                    <div className="fe-mono mt-1" style={{ color: "var(--fe-steel)", fontSize: 11.5, letterSpacing: "0.08em" }}>Future Earth Energy Systems</div>
                  </div>
                </div>
                <div className="fe-vision mt-5">
                  <img src={vision2030} alt="Saudi Vision 2030" loading="lazy" />
                  <span className="fe-vision-text">{c.vision2030}</span>
                </div>
              </div>
            </Reveal>

            {/* Statement */}
            <div>
              <Reveal><div className="fe-eyebrow">{isRtl ? "الرسالة التنفيذية" : "Executive Message"}</div></Reveal>
              <Reveal delay={0.1}>
                <Quote size={40} style={{ color: "var(--fe-amber)", marginTop: 18 }} className="fe-flip-x" />
              </Reveal>
              <Reveal delay={0.15}>
                <p className="fe-display mt-4" style={{ fontSize: "clamp(1.25rem,2vw,1.75rem)", lineHeight: 1.45, fontWeight: 500, color: "var(--fe-navy)", letterSpacing: "-0.01em" }}>
                  {c.executiveStatement}
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="mt-10 pt-8" style={{ borderTop: "1px solid var(--fe-line)" }}>
                  <h3 className="fe-display" style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--fe-navy)" }}>{c.legacyTitle}</h3>
                  <p className="fe-lead mt-4">{c.legacy}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Accreditations & Compliance ============ */}
      <Credentials locale={locale} />

      {/* ============ Operational Values & ROI ============ */}
      <section className="fe-section">
        <div className="fe-container">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-28">
              <Reveal><div className="fe-eyebrow">{c.valuesEyebrow}</div></Reveal>
              <Reveal delay={0.1}><h2 className="fe-display fe-h2 mt-4" style={{ fontWeight: 600 }}>{c.valuesTitle}</h2></Reveal>
              <Reveal delay={0.2}>
                <div className="mt-8 rounded-3xl p-8 fe-card-dark relative overflow-hidden">
                  <div className="fe-glow-sky" />
                  <div className="relative">
                    <div className="fe-display" style={{ fontSize: "clamp(3rem,6vw,4.5rem)", fontWeight: 600, color: "var(--fe-amber)", lineHeight: 1, letterSpacing: "-0.03em" }}>6×</div>
                    <p className="mt-3" style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.55, maxWidth: 320 }}>
                      {isRtl ? "عوائد موثقة تصل إلى 6 أضعاف التكلفة الرأسمالية الأولية." : "Proven returns of up to 6 times the initial capital layout."}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <div>
              {c.values.map((v, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className="flex gap-6 py-7" style={{ borderTop: "1px solid var(--fe-line)" }}>
                    <span className="fe-index" style={{ fontSize: "1.5rem", minWidth: 44 }}>0{i + 1}</span>
                    <div>
                      <h3 className="fe-display" style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--fe-navy)" }}>{v.t}</h3>
                      <p className="mt-2" style={{ color: "var(--fe-slate)", lineHeight: 1.6 }}>{v.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
              <div style={{ borderTop: "1px solid var(--fe-line)" }} />
            </div>
          </div>
        </div>
      </section>

      <LogoWall locale={locale} variant="compact" />

      <CTARibbon locale={locale} title={home[locale].ribbonTitle} sub={home[locale].ribbonSub} cta={home[locale].ribbonCta} />
    </SiteLayout>
  );
}
