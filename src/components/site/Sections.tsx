import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal, SplitHeadline } from "./Reveal";
import type { Locale } from "@/content/site";

/** Inner-page hero — dark, blueprint motif, optional background photo. */
export function PageHero({
  locale,
  eyebrow,
  title,
  lead,
  image,
  imageAlt = "",
  caption,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  lead?: string;
  image?: string;
  imageAlt?: string;
  caption?: string;
}) {
  return (
    <section className="relative overflow-hidden fe-blueprint-dark" style={{ background: "var(--fe-grad-dark)", color: "white", paddingBlock: "clamp(8rem,14vw,11rem) clamp(3.5rem,7vw,6rem)" }}>
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt={imageAlt} className="w-full h-full object-cover" style={{ opacity: 0.26 }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,27,46,0.72) 0%, rgba(10,27,46,0.86) 55%, rgba(10,27,46,0.97) 100%)" }} />
        </div>
      )}
      <div className="fe-glow-sky" />
      <div className="fe-container relative">
        <Reveal><div className="fe-eyebrow" style={{ color: "var(--fe-amber)" }}>{eyebrow}</div></Reveal>
        <SplitHeadline text={title} className="fe-display mt-6" style={{ fontSize: "clamp(2.4rem,5.4vw,4.6rem)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.04, maxWidth: "20ch" }} />
        {lead && (
          <Reveal delay={0.3}><p className="fe-lead mt-6" style={{ color: "rgba(255,255,255,0.76)", maxWidth: 680 }}>{lead}</p></Reveal>
        )}
        {caption && (
          <Reveal delay={0.4}>
            <div className="mt-8 inline-flex items-center gap-2.5 fe-mono" style={{ fontSize: 12, letterSpacing: "0.1em", color: "var(--fe-steel)", textTransform: "uppercase" }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--fe-amber)" }} />
              {caption}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "start",
  tone = "dark",
  maxWidth = 640,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "start" | "center";
  tone?: "dark" | "light";
  maxWidth?: number;
}) {
  const isCenter = align === "center";
  const titleColor = tone === "light" ? "white" : "var(--fe-navy)";
  const leadColor = tone === "light" ? "rgba(255,255,255,0.72)" : undefined;
  return (
    <div className={isCenter ? "text-center mx-auto" : ""} style={{ maxWidth }}>
      {eyebrow && (
        <Reveal>
          <div className="fe-eyebrow" style={{ justifyContent: isCenter ? "center" : undefined }}>{eyebrow}</div>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className="fe-display fe-h2 mt-4" style={{ fontWeight: 600, color: titleColor }}>{title}</h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.16}>
          <p className="fe-lead mt-5" style={{ color: leadColor }}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Conversion ribbon — the institutional CTA band. */
export function CTARibbon({
  locale,
  title,
  sub,
  cta,
}: {
  locale: Locale;
  title: string;
  sub: string;
  cta: string;
}) {
  const isRtl = locale === "ar";
  return (
    <section className="fe-section">
      <div className="fe-container">
        <Reveal>
          <div
            className="relative overflow-hidden fe-blueprint-dark"
            style={{
              background: "var(--fe-grad-dark)",
              borderRadius: "var(--fe-r-xl)",
              padding: "clamp(1.75rem,5vw,4.5rem)",
              isolation: "isolate",
              WebkitMaskImage: "-webkit-radial-gradient(white, black)",
            }}
          >
            <div className="fe-glow-sky" />
            <div className="fe-noise" />
            <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
              <div>
                <h2 className="fe-display" style={{ color: "white", fontSize: "clamp(1.8rem,3.6vw,3rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.1, maxWidth: "20ch" }}>{title}</h2>
                <p className="mt-5" style={{ color: "rgba(255,255,255,0.72)", fontSize: "1.05rem", lineHeight: 1.6, maxWidth: 560 }}>{sub}</p>
              </div>
              <div className="lg:justify-self-end">
                <Link to={isRtl ? "/ar/contact" : "/contact"} className="fe-btn fe-btn-primary" style={{ padding: "1.1rem 1.9rem", fontSize: "1rem" }}>
                  {cta} <ArrowRight size={18} className="fe-flip-x" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Section-level CTA link that routes to the contact assessment form. */
export function SectionCTA({ locale, label }: { locale: Locale; label: string }) {
  const isRtl = locale === "ar";
  return (
    <Link to={isRtl ? "/ar/contact" : "/contact"} className="fe-btn fe-btn-primary">
      {label} <ArrowRight size={16} className="fe-flip-x" />
    </Link>
  );
}

export function Stat({ big, label, tone = "dark" }: { big: ReactNode; label: string; tone?: "dark" | "light" }) {
  return (
    <div>
      <div className="fe-display" style={{ fontSize: "clamp(2rem,3.4vw,2.9rem)", fontWeight: 600, letterSpacing: "-0.03em", color: tone === "light" ? "white" : "var(--fe-navy)" }}>{big}</div>
      <div className="mt-1.5" style={{ fontSize: "0.9rem", color: tone === "light" ? "rgba(255,255,255,0.62)" : "var(--fe-slate)" }}>{label}</div>
    </div>
  );
}
