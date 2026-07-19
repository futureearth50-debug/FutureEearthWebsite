import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { about, type Locale } from "@/content/site";
import { Reveal } from "./Reveal";
import { getLenis } from "@/lib/motion";

import moeDoc from "@/assets/certificates/ministry-of-energy-accreditation.jpg";
import iso9001 from "@/assets/certificates/iso-9001-quality.png";
import iso45001 from "@/assets/certificates/iso-45001-safety.png";
import iso14001 from "@/assets/certificates/iso-14001-environment.png";

export function Credentials({ locale }: { locale: Locale }) {
  const c = about[locale];
  const isRtl = locale === "ar";
  const [open, setOpen] = useState<number | null>(null);

  const std = (code: string) => c.standards.find((s) => s.code === code)!;

  // Everything with a real document behind it is zoomable, per the compliance brief.
  const docs = [
    { src: moeDoc, kind: "document" as const, ...std("MOE") },
    { src: iso9001, kind: "seal" as const, ...std("9001") },
    { src: iso45001, kind: "seal" as const, ...std("45001") },
    { src: iso14001, kind: "seal" as const, ...std("14001") },
  ];
  const seals = docs.filter((d) => d.kind === "seal");
  const ledger = [std("SEC"), std("HRSD")];

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: number) => setOpen((i) => (i === null ? null : (i + dir + docs.length) % docs.length)),
    [docs.length],
  );

  useEffect(() => {
    if (open === null) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(isRtl ? -1 : 1);
      if (e.key === "ArrowLeft") step(isRtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open, close, step, isRtl]);

  const zoomLabel = isRtl ? "اضغط للتكبير" : "Click to enlarge";

  return (
    <section className="fe-section relative overflow-hidden fe-blueprint" style={{ background: "var(--fe-cloud)" }}>
      <div className="fe-container relative">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-16 items-end mb-14">
          <div>
            <Reveal>
              <div className="fe-eyebrow">{c.accreditationEyebrow}</div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="fe-display fe-h2 mt-4" style={{ fontWeight: 600 }}>
                {c.accreditationTitle}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <p className="fe-lead">{c.accreditationIntro}</p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-8 lg:gap-14 items-stretch">
          {/* ---------- Featured official document: Ministry of Energy ---------- */}
          <Reveal>
            <button
              type="button"
              onClick={() => setOpen(0)}
              className="fe-doc group w-full text-start"
              aria-label={`${std("MOE").t} — ${zoomLabel}`}
            >
              <div className="fe-doc-head">
                <span className="fe-mono fe-doc-ref">MOE · 2 MW</span>
                <span className="fe-doc-verified">
                  <BadgeCheck size={14} />
                  {isRtl ? "وثيقة رسمية" : "Official document"}
                </span>
              </div>

              <div className="fe-doc-sheet">
                <img src={moeDoc} alt={std("MOE").t} loading="lazy" />
                <span className="fe-doc-zoom">
                  <Maximize2 size={15} />
                  {zoomLabel}
                </span>
              </div>

              <div className="fe-doc-foot">
                <h3 className="fe-display" style={{ fontSize: "1.05rem", fontWeight: 600, color: "var(--fe-navy)" }}>
                  {std("MOE").t}
                </h3>
                <p className="mt-1.5" style={{ color: "var(--fe-slate)", fontSize: "0.9rem", lineHeight: 1.55 }}>
                  {std("MOE").d}
                </p>
              </div>
            </button>
          </Reveal>

          <div className="flex flex-col">
            {/* ---------- ISO seals ---------- */}
            <div className="grid gap-4 sm:grid-cols-3">
              {seals.map((s, i) => (
                <Reveal key={s.code} delay={0.08 + i * 0.07}>
                  <button
                    type="button"
                    onClick={() => setOpen(docs.indexOf(s))}
                    className="fe-sealmark group w-full text-center"
                    aria-label={`${s.t} — ${zoomLabel}`}
                  >
                    <span className="fe-sealmark-disc">
                      <img src={s.src} alt={s.t} loading="lazy" />
                    </span>
                    <span className="fe-sealmark-title fe-display">{s.t}</span>
                    <span className="fe-sealmark-desc">{s.d}</span>
                  </button>
                </Reveal>
              ))}
            </div>

            {/* ---------- Remaining credentials ledger ---------- */}
            <Reveal delay={0.28} className="mt-4 flex flex-1">
              <div className="fe-ledger w-full flex flex-col justify-center">
                {ledger.map((s) => (
                  <div key={s.code} className="fe-ledger-row">
                    <span className="fe-ledger-code fe-mono">{s.code}</span>
                    <div>
                      <h3 className="fe-display" style={{ fontSize: "1rem", fontWeight: 600, color: "var(--fe-navy)" }}>
                        {s.t}
                      </h3>
                      <p className="mt-1" style={{ color: "var(--fe-slate)", fontSize: "0.9rem", lineHeight: 1.55 }}>
                        {s.d}
                      </p>
                    </div>
                    <BadgeCheck size={17} style={{ color: "var(--fe-green)", flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ---------- Fullscreen zoom viewer ---------- */}
      {open !== null && (
        <div className="fe-lightbox" role="dialog" aria-modal="true" aria-label={docs[open].t}>
          <div className="fe-lightbox-scrim" onClick={close} />
          <div className="fe-noise" />

          <button className="fe-lightbox-close" onClick={close} aria-label={isRtl ? "إغلاق" : "Close"}>
            <X size={20} />
          </button>

          <button
            className="fe-lightbox-nav"
            style={{ [isRtl ? "right" : "left"]: "clamp(0.75rem, 3vw, 2rem)" }}
            onClick={() => step(-1)}
            aria-label={isRtl ? "السابق" : "Previous"}
          >
            <ChevronLeft size={22} className="fe-flip-x" />
          </button>
          <button
            className="fe-lightbox-nav"
            style={{ [isRtl ? "left" : "right"]: "clamp(0.75rem, 3vw, 2rem)" }}
            onClick={() => step(1)}
            aria-label={isRtl ? "التالي" : "Next"}
          >
            <ChevronRight size={22} className="fe-flip-x" />
          </button>

          <div className="fe-lightbox-body">
            <div className="fe-lightbox-sheet" key={open}>
              <img src={docs[open].src} alt={docs[open].t} />
            </div>
            <div className="fe-lightbox-meta">
              <span className="fe-mono fe-lightbox-index">
                {String(open + 1).padStart(2, "0")} / {String(docs.length).padStart(2, "0")}
              </span>
              <h3 className="fe-display mt-2" style={{ color: "white", fontSize: "clamp(1.1rem,2vw,1.5rem)", fontWeight: 600 }}>
                {docs[open].t}
              </h3>
              <p className="mt-2" style={{ color: "rgba(255,255,255,0.66)", lineHeight: 1.6, maxWidth: "60ch" }}>
                {docs[open].d}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
