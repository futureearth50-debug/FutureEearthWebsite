import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock, Linkedin, Instagram, Facebook } from "lucide-react";
import { footer, contactInfo, ui, type Locale } from "@/content/site";
import { Brand } from "./Brand";

export function Footer({ locale }: { locale: Locale }) {
  const f = footer[locale];
  const t = ui[locale];
  const isRtl = locale === "ar";

  return (
    <footer className="relative overflow-hidden fe-blueprint-dark" style={{ background: "var(--fe-navy)", color: "rgba(255,255,255,0.82)" }}>
      <div className="fe-glow-steel" />
      <div className="fe-container relative" style={{ paddingBlock: "clamp(3.5rem,6vw,5.5rem)" }}>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1.3fr]">
          {/* Brand + description */}
          <div>
            <Brand locale={locale} tone="light" />
            <p className="mt-6" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: 420, fontSize: "0.95rem" }}>
              {f.description}
            </p>
            <div className="mt-7 flex items-center gap-3">
              {[Linkedin, Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="grid place-items-center rounded-full transition-all hover:-translate-y-0.5" style={{ width: 38, height: 38, background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick access */}
          <div>
            <div className="fe-eyebrow no-tick" style={{ color: "var(--fe-steel)" }}>{f.quickTitle}</div>
            <ul className="mt-5 space-y-3">
              {f.quick.map((l) => (
                <li key={l.l}>
                  <Link to={l.to as string} className="inline-flex items-center gap-2 transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.95rem" }}>
                    <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--fe-amber)", opacity: 0.7 }} />
                    {l.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + identity */}
          <div>
            <div className="fe-eyebrow no-tick" style={{ color: "var(--fe-steel)" }}>{f.contactTitle}</div>
            <div className="mt-5 space-y-3.5 text-sm" style={{ color: "rgba(255,255,255,0.78)" }}>
              <div className="flex items-start gap-3"><MapPin size={17} style={{ marginTop: 2, color: "var(--fe-amber)", flexShrink: 0 }} /><span style={{ lineHeight: 1.55 }}>{contactInfo.address[locale]}</span></div>
              {/* Both lines stay independently dialable rather than sharing one tel: */}
              <div className="flex items-start gap-3">
                <Phone size={17} style={{ marginTop: 2, color: "var(--fe-amber)", flexShrink: 0 }} />
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1" dir="ltr">
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors">{contactInfo.phoneDisplay}</a>
                  <span aria-hidden style={{ color: "rgba(255,255,255,0.35)" }}>/</span>
                  <a href={`tel:${contactInfo.phoneAlt}`} className="hover:text-white transition-colors">{contactInfo.phoneAltDisplay}</a>
                </span>
              </div>
              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 hover:text-white transition-colors"><Mail size={17} style={{ color: "var(--fe-amber)", flexShrink: 0 }} /><span>{contactInfo.email}</span></a>
              <div className="flex items-start gap-3"><Clock size={17} style={{ marginTop: 2, color: "var(--fe-amber)", flexShrink: 0 }} /><span style={{ lineHeight: 1.55 }}>{contactInfo.hours[locale]}</span></div>
            </div>
          </div>
        </div>

        <div className="fe-hairline-dark mt-12 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{f.rights}</div>
          <Link to={t.switchTo as string} className="inline-flex items-center gap-2 text-sm px-3.5 py-1.5 rounded-full transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.14)" }}>
            {t.switch}
          </Link>
        </div>
      </div>
    </footer>
  );
}
