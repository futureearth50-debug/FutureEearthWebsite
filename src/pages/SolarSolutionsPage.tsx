import { Link } from "@tanstack/react-router";
import { Sun, Diamond, Cpu, ArrowRight, CheckCircle2 } from "lucide-react";
import { solar, home, type Locale } from "@/content/site";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { PageHero, CTARibbon } from "@/components/site/Sections";
import rooftopImg from "@/assets/projects/rooftop-array-complex.webp";
import groundImg from "@/assets/projects/ground-mount-desert.webp";
import hybridImg from "@/assets/projects/solar-substation-grid.webp";

const icons = [Sun, Diamond, Cpu];
const images = [rooftopImg, groundImg, hybridImg];

export function SolarSolutionsPage({ locale }: { locale: Locale }) {
  const c = solar[locale];
  const isRtl = locale === "ar";
  const base = isRtl ? "/ar/solar-solutions" : "/solar-solutions";

  return (
    <SiteLayout locale={locale}>
      <PageHero
        locale={locale}
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.lead}
        image={groundImg}
        imageAlt="Ground-mounted solar field in the Saudi desert"
      />

      {/* ============ Three solution routes ============ */}
      <section className="fe-section">
        <div className="fe-container">
          <div className="space-y-8 lg:space-y-12">
            {c.parts.map((p, i) => {
              const Icon = icons[i];
              const flip = i % 2 === 1;
              return (
                <Reveal key={p.slug} delay={i * 0.06}>
                  <Link to={`${base}/${p.slug}` as string} className="fe-solcard group">
                    <div className={`fe-solcard-media ${flip ? "lg:order-2" : ""}`}>
                      <img src={images[i]} alt={p.headline} loading="lazy" />
                      <div className="fe-solcard-veil" />
                      <span className="fe-solcard-no fe-index">{p.no}</span>
                    </div>

                    <div className={`fe-solcard-body ${flip ? "lg:order-1" : ""}`}>
                      <div className="grid place-items-center rounded-xl" style={{ width: 48, height: 48, background: "var(--fe-grad-sun)", color: "#221200" }}>
                        <Icon size={22} />
                      </div>
                      <h2 className="fe-display mt-5" style={{ fontSize: "clamp(1.5rem,2.6vw,2.15rem)", fontWeight: 600, color: "var(--fe-navy)", lineHeight: 1.15 }}>
                        {p.headline}
                      </h2>
                      <p className="fe-lead mt-4">{p.short}</p>

                      {/* mb on the list, not mt on the button: the card's
                          `margin-top: auto` (which bottom-aligns the button)
                          overrides any top margin set here. */}
                      <ul className="mt-6 mb-10 lg:mb-12 flex flex-col gap-3">
                        {p.pillars.map((pl) => (
                          <li key={pl.t} className="flex items-start gap-2.5">
                            <CheckCircle2 size={16} style={{ color: "var(--fe-green)", marginTop: 4, flexShrink: 0 }} />
                            <span style={{ color: "var(--fe-slate)", fontSize: "0.93rem", lineHeight: 1.7 }}>{pl.t}</span>
                          </li>
                        ))}
                      </ul>

                      <span className="fe-btn fe-btn-dark" style={{ padding: "0.78rem 1.3rem", fontSize: "0.88rem" }}>
                        {isRtl ? "عرض الحل بالكامل" : "View full solution"}
                        <ArrowRight size={15} className="fe-flip-x" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTARibbon locale={locale} title={home[locale].ribbonTitle} sub={home[locale].ribbonSub} cta={home[locale].ribbonCta} />
    </SiteLayout>
  );
}
