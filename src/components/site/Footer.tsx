import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock, Linkedin, Instagram, Facebook, ShieldCheck } from "lucide-react";
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
              <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-3 hover:text-white transition-colors"><Phone size={17} style={{ color: "var(--fe-amber)", flexShrink: 0 }} /><span dir="ltr">{contactInfo.phoneDisplay}</span></a>
              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 hover:text-white transition-colors"><Mail size={17} style={{ color: "var(--fe-amber)", flexShrink: 0 }} /><span>{contactInfo.email}</span></a>
              <div className="flex items-start gap-3"><Clock size={17} style={{ marginTop: 2, color: "var(--fe-amber)", flexShrink: 0 }} /><span style={{ lineHeight: 1.55 }}>{contactInfo.hours[locale]}</span></div>
            </div>
          </div>
        </div>

        {/* Corporate identification band */}
        <div className="mt-12 pt-8 grid gap-5 sm:grid-cols-2" style={{ borderTop: "1px solid rgba(255,255,255,0.09)" }}>
          {f.identity.map((id) => (
            <div key={id.k} className="flex items-start gap-3">
              <ShieldCheck size={18} style={{ color: "var(--fe-steel)", marginTop: 2, flexShrink: 0 }} />
              <div>
                <div className="fe-mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fe-steel-2)" }}>{id.k}</div>
                <div className="mt-1" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{id.v}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="fe-hairline-dark my-8" />

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
