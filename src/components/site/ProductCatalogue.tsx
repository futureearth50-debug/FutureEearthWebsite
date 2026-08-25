import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ArrowRight, Layers3, Server, PlayCircle, FileText, Maximize2, X, Boxes } from "lucide-react";
import { products, type Locale } from "@/content/site";
import { Reveal } from "./Reveal";
import { MediaModal, type Media } from "./MediaModal";
import { getLenis } from "@/lib/motion";

import l1Img from "@/assets/products/sav-l1-cabinet.png";
import s1Img from "@/assets/products/sav-s1-cabinet.png";
import s1Spec from "@/assets/products/sav-s1-specsheet.png";
import hybridScene from "@/assets/products/sav-applications.jpg";
import p600Img from "@/assets/products/600W/600 Front 1.png";
import p1200Img from "@/assets/products/1200W/1200 Front.png";
import p2400Img from "@/assets/products/2400W/2400 Front 1.png";
import unitsImg from "@/assets/products/units.png";
import rackImg from "@/assets/products/rooftop-product.png";

type CatalogueItem = (typeof products)["en"]["catalogue"][number];

type AssetDef = {
  img?: string;
  cover?: boolean;
  icon?: typeof Layers3;
  video?: string;
  specImg?: string;
};

const ASSETS: Record<string, AssetDef> = {
  l1: { img: l1Img, video: "/media/sav-l1-product.mp4" },
  s1: { img: s1Img, specImg: s1Spec },
  stackable: { img: unitsImg },
  rack: { img: rackImg, cover: true },
  hybrid: { img: hybridScene, cover: true },
  p600: { img: p600Img },
  p1200: { img: p1200Img },
  p2400: { img: p2400Img },
};

export function ProductCatalogue({ locale }: { locale: Locale }) {
  const c = products[locale];
  const isRtl = locale === "ar";
  const contactTo = isRtl ? "/ar/contact" : "/contact";

  const [active, setActive] = useState("all");
  const [selected, setSelected] = useState<CatalogueItem | null>(null);
  const [media, setMedia] = useState<Media | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Header dropdown links here as /products#<category-id> — jump the filter
  // to match whenever that hash is present or changes.
  const hash = useRouterState({ select: (s) => s.location.hash });
  useEffect(() => {
    if (!hash || !c.categories.some((cat) => cat.id === hash)) return;
    setActive(hash);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash, c.categories]);

  const filtered = useMemo(
    () => (active === "all" ? c.catalogue : c.catalogue.filter((p) => p.category === active)),
    [active, c.catalogue],
  );

  // Keep the active tab in view when the filter scrolls horizontally on small screens
  // (native scrollIntoView is RTL-aware; block:nearest avoids vertical page scroll).
  useEffect(() => {
    const wrap = tabsRef.current;
    if (!wrap) return;
    const el = wrap.querySelector<HTMLElement>(`[data-cat="${active}"]`);
    if (el && wrap.scrollWidth > wrap.clientWidth) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [active]);

  // Animate cards in on filter change
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = grid.querySelectorAll(".fe-pcard");
    const tween = gsap.fromTo(
      cards,
      { opacity: 0, y: 26, scale: 0.975 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.06, ease: "power3.out", overwrite: true },
    );
    return () => { tween.kill(); };
  }, [active]);

  // Detail modal scroll lock
  useEffect(() => {
    if (!selected) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [selected]);

  const renderMedia = (item: CatalogueItem, big = false) => {
    const a = ASSETS[item.id] || {};
    if (a.img && a.cover) {
      return (
        <div className="fe-pcard-media fe-pcard-cover">
          <img src={a.img} alt={item.name} loading="lazy" />
          <div className="fe-pcard-cover-veil" />
        </div>
      );
    }
    if (a.img) {
      return (
        <div className="fe-pcard-media fe-pcard-plate">
          <img src={a.img} alt={item.name} loading="lazy" style={big ? { maxHeight: "100%" } : undefined} />
        </div>
      );
    }
    const Icon = a.icon || Boxes;
    return (
      <div className="fe-pcard-media fe-pcard-illus">
        <div className="fe-pcard-illus-grid" />
        <Icon size={big ? 84 : 60} strokeWidth={1.1} />
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="fe-section" style={{ background: "var(--fe-cloud)" }}>
      <div className="fe-container">
        <div className="max-w-3xl">
          <Reveal><div className="fe-eyebrow">{c.catalogueEyebrow}</div></Reveal>
          <Reveal delay={0.1}><h2 className="fe-display fe-h2 mt-4" style={{ fontWeight: 600 }}>{c.catalogueTitle}</h2></Reveal>
          <Reveal delay={0.15}><p className="fe-lead mt-5">{c.catalogueLead}</p></Reveal>
        </div>

        {/* Category filter */}
        <Reveal delay={0.1}>
          <div className="fe-catfilter" ref={tabsRef}>
            {c.categories.map((cat) => (
              <button
                key={cat.id}
                data-cat={cat.id}
                className={`fe-catfilter-btn ${active === cat.id ? "is-active" : ""}`}
                onClick={() => setActive(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Product grid */}
        <div ref={gridRef} className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => {
            const a = ASSETS[item.id] || {};
            return (
              <button key={item.id} className="fe-pcard group text-start" onClick={() => setSelected(item)}>
                {renderMedia(item)}
                <div className="fe-pcard-body">
                  <div className="fe-pcard-family fe-mono">{item.family}</div>
                  <h3 className="fe-pcard-name fe-display">{item.name}</h3>
                  <p className="fe-pcard-tag">{item.tagline}</p>

                  <div className="fe-pcard-metrics">
                    <div>
                      <span className="fe-pcard-metric fe-display">{item.power}</span>
                      <span className="fe-pcard-metric-l">{isRtl ? "القدرة" : "Power"}</span>
                    </div>
                    <div>
                      <span className="fe-pcard-metric fe-display">{item.capacity}</span>
                      <span className="fe-pcard-metric-l">{isRtl ? "السعة" : "Capacity"}</span>
                    </div>
                  </div>

                  <div className="fe-pcard-foot">
                    {(a.video || a.specImg) && (
                      <div className="fe-pcard-flags">
                        {a.video && <span className="fe-pcard-flag"><PlayCircle size={12} /> {isRtl ? "فيديو" : "Video"}</span>}
                        {a.specImg && <span className="fe-pcard-flag"><FileText size={12} /> {isRtl ? "مواصفات" : "Spec sheet"}</span>}
                      </div>
                    )}
                    <span className="fe-pcard-cta">
                      {c.catalogueViewDetail}
                      <ArrowRight size={16} className="fe-flip-x" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- Product detail modal ---------- */}
      {selected && (() => {
        const a = ASSETS[selected.id] || {};
        return (
          <div className="fe-pdetail" role="dialog" aria-modal="true" aria-label={selected.name}>
            <div className="fe-pdetail-scrim" onClick={() => setSelected(null)} />
            <div className="fe-pdetail-panel">
              <button className="fe-pdetail-close" onClick={() => setSelected(null)} aria-label={isRtl ? "إغلاق" : "Close"}>
                <X size={18} />
              </button>

              <div className="fe-pdetail-visual">
                {renderMedia(selected, true)}
                {selected.badges?.length > 0 && (
                  <div className="fe-pdetail-badges">
                    {selected.badges.map((b) => <span key={b} className="fe-badge">{b}</span>)}
                  </div>
                )}
              </div>

              <div className="fe-pdetail-info">
                <div className="fe-pcard-family fe-mono">{selected.family}</div>
                <h3 className="fe-display" style={{ fontSize: "clamp(1.6rem,2.6vw,2.2rem)", fontWeight: 600, color: "var(--fe-navy)", marginTop: 6 }}>
                  {selected.name}
                </h3>
                <p className="fe-lead mt-4" style={{ fontSize: "1.02rem" }}>{selected.blurb}</p>

                <div className="fe-mono mt-8 mb-3" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fe-slate-2)" }}>
                  {c.catalogueSpecsLabel}
                </div>
                <dl className="fe-specs">
                  {selected.specs.map((s) => (
                    <div key={s.k} className="fe-specs-row">
                      <dt>{s.k}</dt>
                      <dd className="fe-display">{s.v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="fe-pdetail-actions">
                  {a.video && (
                    <button className="fe-btn fe-btn-primary" onClick={() => setMedia({ type: "video", src: a.video!, title: selected.name })}>
                      <PlayCircle size={16} /> {c.catalogueWatch}
                    </button>
                  )}
                  {a.specImg && (
                    <button className="fe-btn fe-btn-steel" onClick={() => setMedia({ type: "image", src: a.specImg!, title: `${selected.name} — ${c.catalogueSpecsLabel}` })}>
                      <Maximize2 size={16} /> {c.catalogueSpecSheet}
                    </button>
                  )}
                  {selected.datasheet && (
                    <a className="fe-btn fe-btn-green" href={selected.datasheet} target="_blank" rel="noopener noreferrer">
                      <FileText size={16} /> {c.catalogueDatasheet}
                    </a>
                  )}
                  <Link to={contactTo} className="fe-btn fe-btn-dark">
                    {c.catalogueQuote} <ArrowRight size={15} className="fe-flip-x" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <MediaModal media={media} onClose={() => setMedia(null)} locale={locale} />
    </section>
  );
}
