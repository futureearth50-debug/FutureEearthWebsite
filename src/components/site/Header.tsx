/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Globe, ArrowRight, ChevronDown } from "lucide-react";
import { nav, ui, solar, type Locale } from "@/content/site";
import { Brand } from "./Brand";


export function Header({ locale }: { locale: Locale }) {
  const items = nav[locale];
  const t = ui[locale];
  const isRtl = locale === "ar";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const solarBase = isRtl ? "/ar/solar-solutions" : "/solar-solutions";
  const solarSubs = solar[locale].parts.map((p) => ({
    to: `${solarBase}/${p.slug}`,
    label: p.navLabel,
    short: p.short,
    no: p.no,
  }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); setSubOpen(false); }, [pathname]);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(10,27,46,0.90)" : "transparent",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(1.3)" : "none",
        backdropFilter: scrolled ? "blur(16px) saturate(1.3)" : "none",
        borderBottom: scrolled ? "1px solid rgba(143,180,214,0.12)" : "1px solid transparent",
      }}
    >
      <div className="fe-container flex items-center justify-between" style={{ height: 78 }}>
        <Brand locale={locale} tone="light" />

        <nav className="hidden lg:flex items-center gap-9">
          {items.map((n) => {
            const hasSub = n.to === solarBase;
            const active = hasSub ? pathname.startsWith(solarBase) : pathname === n.to;

            const link = (
              <Link
                to={n.to}
                className="relative py-1 text-sm transition-colors group inline-flex items-center gap-1.5"
                style={{ color: active ? "var(--fe-amber)" : "rgba(255,255,255,0.82)", fontFamily: "var(--fe-font-display)", fontWeight: 500 }}
              >
                {n.label}
                {hasSub && <ChevronDown size={14} className="fe-navdrop-chev" />}
                <span
                  className="absolute -bottom-0.5 inset-x-0 h-px origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ background: "var(--fe-amber)", transform: active ? "scaleX(1)" : undefined }}
                />
              </Link>
            );

            if (!hasSub) return <div key={n.to}>{link}</div>;

            return (
              <div key={n.to} className="fe-navdrop">
                {link}
                <div className="fe-navdrop-panel">
                  {solarSubs.map((s) => (
                    <Link key={s.to} to={s.to as string} className="fe-navdrop-item">
                      <span className="fe-index fe-navdrop-no">{s.no}</span>
                      <span>
                        <span className="fe-navdrop-label fe-display">{s.label}</span>
                        <span className="fe-navdrop-desc">{s.short}</span>
                      </span>
                      <ArrowRight size={15} className="fe-flip-x fe-navdrop-arrow" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to={t.switchTo as string}
            aria-label={t.switch as string}
            className="inline-flex items-center gap-1.5 text-sm rounded-full transition-colors p-2 sm:px-3 sm:py-1.5"
            style={{ color: "rgba(255,255,255,0.9)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <Globe size={14} />
            <span className="hidden sm:inline">{t.switch}</span>
          </Link>
          <button className="lg:hidden text-white p-2 -mx-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fe-blueprint-dark" style={{ background: "var(--fe-navy)", borderTop: "1px solid rgba(143,180,214,0.12)", maxHeight: "calc(100vh - 78px)", overflowY: "auto" }}>
          <div className="fe-container py-7 flex flex-col gap-1">
            {items.map((n, i) => {
              const hasSub = n.to === solarBase;
              return (
                <div key={n.to} className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center justify-between">
                    <Link to={n.to} className="flex-1 py-3 text-white text-lg fe-display" style={{ fontWeight: 500 }}>
                      {n.label}
                    </Link>
                    {hasSub ? (
                      <button
                        onClick={() => setSubOpen(!subOpen)}
                        aria-label={n.label}
                        aria-expanded={subOpen}
                        className="p-3 -me-3"
                        style={{ color: "var(--fe-steel)" }}
                      >
                        <ChevronDown size={18} style={{ transform: subOpen ? "rotate(180deg)" : undefined, transition: "transform 0.35s var(--fe-ease)" }} />
                      </button>
                    ) : (
                      <span className="fe-index" style={{ fontSize: 12, color: "var(--fe-steel-2)" }}>0{i + 1}</span>
                    )}
                  </div>

                  {hasSub && subOpen && (
                    <div className="pb-3 flex flex-col gap-1">
                      {solarSubs.map((s) => (
                        <Link
                          key={s.to}
                          to={s.to as string}
                          className="flex items-center gap-3 py-2.5 ps-4 rounded-lg"
                          style={{ color: "rgba(255,255,255,0.78)", borderInlineStart: "2px solid rgba(143,180,214,0.25)" }}
                        >
                          <span className="fe-index" style={{ fontSize: 11 }}>{s.no}</span>
                          <span className="fe-display" style={{ fontSize: "0.98rem", fontWeight: 500 }}>{s.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex items-center gap-3 mt-5">
              <Link to={locale === "ar" ? "/ar/contact" : "/contact"} className="fe-btn fe-btn-primary flex-1 justify-center">
                {t.getConsultation}
              </Link>
              <Link to={t.switchTo as string} className="fe-btn fe-btn-ghost">
                <Globe size={15} /> {t.switch}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
