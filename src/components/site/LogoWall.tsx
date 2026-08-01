import { clientLogos, partnerLogos, type Logo } from "@/content/logos";
import { ui, type Locale } from "@/content/site";

/* Row headings ("Our Clients" / "Partners") — sized to read as section labels
   rather than fine print. Tracking eases off as the size grows. */
const rowLabel = { size: "clamp(1rem, 1.7vw, 1.35rem)", tracking: "0.1em" };

function Row({ logos, rev = false }: { logos: Logo[]; rev?: boolean }) {
  // Duplicated within a single track (not two sibling tracks): the loop shift is
  // -50% of this one element's own (doubled) width, so it's exactly one logo-set
  // wide and always seamless. Two independent sibling tracks broke under RTL flex
  // (the duplicate landed on the same side content scrolls *toward*, not the side
  // it scrolls *in from*), leaving a growing blank gap on the Arabic homepage.
  const doubled = [...logos, ...logos];
  return (
    <div className="fe-marquee">
      <div className={`fe-marquee-track ${rev ? "rev" : ""}`}>
        {doubled.map((l, i) => (
          <div key={i} className="fe-logo-cell" title={l.name} aria-hidden={i >= logos.length}>
            {/* eager + async: marquee cells are transform-translated, where lazy-load
                fails to trigger and leaves intermittent blank cells */}
            <img src={l.src} alt={i < logos.length ? l.name : ""} loading="eager" decoding="async" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LogoWall({
  locale,
  variant = "full",
}: {
  locale: Locale;
  variant?: "full" | "compact";
}) {
  const t = ui[locale];
  return (
    <section className="fe-section-tight" style={{ background: "var(--fe-paper)", borderBlock: "1px solid var(--fe-line)" }}>
      <div className="fe-container-wide">
        {variant === "full" && (
          <div className="text-center mb-10">
            <h2 className="fe-display mx-auto" style={{ fontSize: "clamp(1.5rem,3vw,2.3rem)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.18, color: "var(--fe-navy)", maxWidth: 720 }}>
              {t.clientsHeadline}
            </h2>
            <p className="mt-4 mx-auto" style={{ fontSize: "clamp(0.98rem,1.3vw,1.1rem)", color: "var(--fe-slate)", maxWidth: 660, lineHeight: 1.65 }}>
              {t.logosLead}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="fe-mono px-1" style={{ fontSize: rowLabel.size, letterSpacing: rowLabel.tracking, textTransform: "uppercase", color: "var(--fe-navy)", fontWeight: 600 }}>
            {t.clientsTitle}
          </div>
          <Row logos={clientLogos} />

          <div className="fe-mono px-1 pt-6" style={{ fontSize: rowLabel.size, letterSpacing: rowLabel.tracking, textTransform: "uppercase", color: "var(--fe-navy)", fontWeight: 600 }}>
            {t.partnersTitle}
          </div>
          <Row logos={partnerLogos} rev />
        </div>
      </div>
    </section>
  );
}
