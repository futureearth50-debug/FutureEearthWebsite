/* eslint-disable prettier/prettier */
import { Link } from "@tanstack/react-router";
import {
  ArrowRight, Sun, Diamond, Cpu, Layers3,
  HardHat, LifeBuoy, Wallet,
} from "lucide-react";
import { solar, products, homeSections, type Locale } from "@/content/site";
import { Reveal } from "./Reveal";

import rooftopImg from "@/assets/projects/rooftop-array-complex.webp";
import groundImg from "@/assets/projects/ground-mount-desert.webp";
import hybridImg from "@/assets/projects/solar-substation-grid.webp";
import l1Img from "@/assets/products/sav-l1-cabinet.png";
import s1Img from "@/assets/products/sav-s1-cabinet.png";
import hybridScene from "@/assets/products/sav-applications.jpg";

/* Shared section header — eyebrow + title + lead, matching the site's other sections. */
function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <div className="max-w-3xl">
      <Reveal><div className="fe-eyebrow">{eyebrow}</div></Reveal>
      <Reveal delay={0.1}><h2 className="fe-display fe-h2 mt-4" style={{ fontWeight: 600 }}>{title}</h2></Reveal>
      <Reveal delay={0.16}><p className="fe-lead mt-5">{lead}</p></Reveal>
    </div>
  );
}

/* ============================ SOLAR ENERGY SOLUTIONS ============================ */
const solIcons = [Sun, Diamond, Cpu];
const solImages = [rooftopImg, groundImg, hybridImg];

export function HomeSolarSolutions({ locale }: { locale: Locale }) {
  const c = homeSections[locale].solar;
  const parts = solar[locale].parts;
  const isRtl = locale === "ar";
  const base = isRtl ? "/ar/solar-solutions" : "/solar-solutions";

  return (
    <section className="fe-section" style={{ background: "var(--fe-cloud)" }}>
      <div className="fe-container">
        <SectionHead eyebrow={c.eyebrow} title={c.title} lead={c.lead} />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {parts.map((p, i) => {
            const Icon = solIcons[i];
            return (
              <Reveal key={p.slug} delay={i * 0.08}>
                <Link
                  to={`${base}/${p.slug}` as string}
                  className="group fe-card h-full"
                  style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}
                >
                  <div className="fe-frame fe-frame-zoom" style={{ borderRadius: 0, aspectRatio: "16 / 10" }}>
                    <img src={solImages[i]} alt={p.headline} loading="lazy" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,27,46,0.05) 0%, rgba(10,27,46,0.5) 100%)" }} />
                    <span
                      className="absolute grid place-items-center rounded-xl"
                      style={{ top: 16, insetInlineStart: 16, width: 46, height: 46, background: "var(--fe-grad-sun)", color: "#221200" }}
                    >
                      <Icon size={21} />
                    </span>
                  </div>
                  <div className="flex flex-col flex-1" style={{ padding: "clamp(1.4rem,2.2vw,1.9rem)" }}>
                    <h3 className="fe-display" style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--fe-navy)", lineHeight: 1.2 }}>{p.navLabel}</h3>
                    <p className="mt-2.5" style={{ color: "var(--fe-slate)", lineHeight: 1.6, fontSize: "0.95rem" }}>{p.short}</p>
                    <span className="fe-link" style={{ marginTop: "auto", paddingTop: "1.3rem" }}>
                      {c.explore} <ArrowRight size={16} className="fe-flip-x" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-11 flex justify-center">
            <Link to={base} className="fe-btn fe-btn-dark">
              {c.viewAll} <ArrowRight size={17} className="fe-flip-x" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================ FEATURED PRODUCTS ============================ */
type Media = { kind: "plate" | "cover" | "illus"; img?: string };
const productMedia: Record<string, Media> = {
  l1: { kind: "plate", img: l1Img },
  s1: { kind: "plate", img: s1Img },
  stackable: { kind: "illus" },
  hybrid: { kind: "cover", img: hybridScene },
};
const featuredIds = ["l1", "s1", "stackable", "hybrid"];

function ProductMedia({ id, name }: { id: string; name: string }) {
  const m = productMedia[id];
  if (m?.kind === "cover" && m.img) {
    return (
      <div className="fe-pcard-media fe-pcard-cover">
        <img src={m.img} alt={name} loading="lazy" />
        <div className="fe-pcard-cover-veil" />
      </div>
    );
  }
  if (m?.kind === "plate" && m.img) {
    return (
      <div className="fe-pcard-media fe-pcard-plate">
        <img src={m.img} alt={name} loading="lazy" />
      </div>
    );
  }
  return (
    <div className="fe-pcard-media fe-pcard-illus">
      <div className="fe-pcard-illus-grid" />
      <Layers3 size={60} strokeWidth={1.1} />
    </div>
  );
}

export function HomeFeaturedProducts({ locale }: { locale: Locale }) {
  const c = homeSections[locale].products;
  const isRtl = locale === "ar";
  const productsTo = isRtl ? "/ar/products" : "/products";
  const catalogue = products[locale].catalogue;
  const items = featuredIds
    .map((id) => catalogue.find((p) => p.id === id))
    .filter((p): p is (typeof catalogue)[number] => Boolean(p));

  return (
    <section className="fe-section" style={{ background: "var(--fe-cloud)" }}>
      <div className="fe-container">
        <SectionHead eyebrow={c.eyebrow} title={c.title} lead={c.lead} />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.07}>
              <Link to={productsTo} className="fe-pcard group h-full">
                <ProductMedia id={item.id} name={item.name} />
                <div className="fe-pcard-body">
                  <div className="fe-pcard-family fe-mono">{item.family}</div>
                  <h3 className="fe-pcard-name fe-display">{item.name}</h3>
                  <p className="fe-pcard-tag">{item.tagline}</p>
                  <div className="fe-pcard-foot">
                    <span className="fe-pcard-cta">
                      {c.learnMore} <ArrowRight size={16} className="fe-flip-x" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-11 flex justify-center">
            <Link to={productsTo} className="fe-btn fe-btn-dark">
              {c.viewAll} <ArrowRight size={17} className="fe-flip-x" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================ OUR SERVICES ============================ */
const serviceIcons = [HardHat, LifeBuoy, Wallet];

export function HomeServices({ locale }: { locale: Locale }) {
  const c = homeSections[locale].services;
  const isRtl = locale === "ar";
  const servicesTo = isRtl ? "/ar/services" : "/services";

  return (
    <section className="relative overflow-hidden fe-blueprint-dark fe-section" style={{ background: "var(--fe-grad-dark)", color: "white" }}>
      <div className="fe-glow-steel" />
      <div className="fe-container relative">
        {/* Header — title left, capability counter + CTA right */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-end mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <Reveal><div className="fe-eyebrow" style={{ color: "var(--fe-amber)" }}>{c.eyebrow}</div></Reveal>
            <Reveal delay={0.1}>
              <h2 className="fe-display mt-5" style={{ fontSize: "clamp(1.9rem,3.6vw,3.1rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{c.title}</h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5" style={{ color: "rgba(255,255,255,0.72)", fontSize: "1.05rem", lineHeight: 1.66, maxWidth: 560 }}>{c.lead}</p>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="flex flex-col items-start lg:items-end gap-5">
              <div className="fe-mono" style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fe-steel-2)" }}>
                0{c.items.length} {isRtl ? "قدرات هندسية" : "Engineering Capabilities"}
              </div>
              <Link to={servicesTo} className="fe-btn fe-btn-primary">
                {c.viewAll} <ArrowRight size={17} className="fe-flip-x" />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Premium capability grid — each card routes to the Services page */}
        <div className="fe-svc-grid">
          {c.items.map((s, i) => {
            const Icon = serviceIcons[i];
            return (
              <Reveal key={s.t} delay={i * 0.09}>
                <Link to={servicesTo} className="fe-svc">
                  <div className="fe-svc-head">
                    <span className="fe-svc-ic"><Icon size={23} /></span>
                    <span className="fe-svc-no">{`0${i + 1}`}</span>
                  </div>
                  <h3 className="fe-svc-title">{s.t}</h3>
                  <p className="fe-svc-desc">{s.d}</p>
                  <span className="fe-svc-cta">
                    {c.explore} <ArrowRight size={15} className="fe-flip-x" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================ CONTACT CTA (compact) ============================ */
export function HomeContactCTA({ locale }: { locale: Locale }) {
  const c = homeSections[locale].contactCta;
  const isRtl = locale === "ar";
  const contactTo = isRtl ? "/ar/contact" : "/contact";

  return (
    <section className="fe-section-tight" style={{ background: "var(--fe-cloud)", borderTop: "1px solid var(--fe-line)" }}>
      <div className="fe-container">
        <Reveal>
          <div className="text-center mx-auto" style={{ maxWidth: 640 }}>
            <div className="fe-eyebrow" style={{ justifyContent: "center" }}>{c.eyebrow}</div>
            <h2 className="fe-display mt-4" style={{ fontSize: "clamp(1.7rem,3.4vw,2.6rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.12, color: "var(--fe-navy)" }}>{c.title}</h2>
            <p className="mt-4 mx-auto" style={{ color: "var(--fe-slate)", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: 520 }}>{c.sub}</p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link to={contactTo} className="fe-btn fe-btn-primary">
                {c.contact} <ArrowRight size={17} className="fe-flip-x" />
              </Link>
              <Link to={contactTo} className="fe-btn fe-btn-outline">
                {c.consult} <ArrowRight size={16} className="fe-flip-x" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
