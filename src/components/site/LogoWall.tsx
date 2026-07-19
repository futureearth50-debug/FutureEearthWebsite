import { clientLogos, partnerLogos, type Logo } from "@/content/logos";
import { ui, type Locale } from "@/content/site";

function Row({ logos, rev = false }: { logos: Logo[]; rev?: boolean }) {
  return (
    <div className="fe-marquee">
      {[0, 1].map((k) => (
        <div key={k} className={`fe-marquee-track ${rev ? "rev" : ""}`} aria-hidden={k === 1}>
          {logos.map((l, i) => (
            <div key={`${k}-${i}`} className="fe-logo-cell" title={l.name}>
              {/* eager + async: marquee cells are transform-translated, where lazy-load
                  fails to trigger and leaves intermittent blank cells */}
              <img src={l.src} alt={l.name} loading="eager" decoding="async" />
            </div>
          ))}
        </div>
      ))}
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
            <div className="fe-eyebrow no-tick" style={{ justifyContent: "center" }}>{t.trustedBy}</div>
            <p className="mt-3 mx-auto" style={{ fontSize: "clamp(1.05rem,1.5vw,1.3rem)", color: "var(--fe-navy)", fontWeight: 500, maxWidth: 640, lineHeight: 1.5 }}>
              {t.logosLead}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <div className="fe-mono px-1" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fe-slate-2)" }}>
            {t.clientsTitle}
          </div>
          <Row logos={clientLogos} />

          <div className="fe-mono px-1 pt-4" style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fe-slate-2)" }}>
            {t.partnersTitle}
          </div>
          <Row logos={partnerLogos} rev />
        </div>
      </div>
    </section>
  );
}
