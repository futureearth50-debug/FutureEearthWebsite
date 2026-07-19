import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { contact, contactInfo, leadAssistant, type Locale } from "@/content/site";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { PageHero } from "@/components/site/Sections";
import { LeadAssistant } from "@/components/site/LeadAssistant";

export function ContactPage({ locale }: { locale: Locale }) {
  const c = contact[locale];
  const la = leadAssistant[locale];
  const isRtl = locale === "ar";

  const infoRows = [
    { icon: MapPin, label: c.officeLabel, value: contactInfo.address[locale] },
    {
      icon: Mail,
      label: c.emailLabel,
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
      ltr: true,
    },
    {
      icon: Phone,
      label: c.phoneLabel,
      value: contactInfo.phoneDisplay,
      href: `tel:${contactInfo.phone}`,
      ltr: true,
    },
    { icon: Clock, label: c.hoursLabel, value: contactInfo.hours[locale] },
  ];

  return (
    <SiteLayout locale={locale}>
      <PageHero locale={locale} eyebrow={la.panelEyebrow} title={c.title} lead={la.heroLead} />

      <section className="fe-section" style={{ background: "var(--fe-paper)" }}>
        <div className="fe-container">
          <div className="grid lg:grid-cols-[0.95fr_1.15fr] gap-8 lg:gap-12 items-start">
            {/* Contact data + map */}
            <div className="space-y-6 lg:sticky lg:top-28">
              <Reveal>
                <div className="fe-card-dark rounded-3xl p-7 md:p-8 fe-blueprint-dark relative overflow-hidden">
                  <div className="fe-glow-steel" />
                  <div className="relative">
                    <div className="fe-eyebrow" style={{ color: "var(--fe-amber)" }}>
                      {isRtl ? "بيانات الاتصال الرسمية" : "Official Contact Data"}
                    </div>
                    <div className="mt-6 space-y-5">
                      {infoRows.map((r, i) => {
                        const Icon = r.icon;
                        const inner = (
                          <>
                            <span
                              className="grid place-items-center rounded-xl shrink-0"
                              style={{
                                width: 42,
                                height: 42,
                                background: "rgba(143,180,214,0.14)",
                                color: "var(--fe-amber)",
                                border: "1px solid rgba(143,180,214,0.18)",
                              }}
                            >
                              <Icon size={18} />
                            </span>
                            <span>
                              <span
                                className="block fe-mono"
                                style={{
                                  fontSize: 10.5,
                                  letterSpacing: "0.12em",
                                  textTransform: "uppercase",
                                  color: "var(--fe-steel-2)",
                                }}
                              >
                                {r.label}
                              </span>
                              <span
                                className="block mt-1"
                                dir={r.ltr ? "ltr" : undefined}
                                style={{
                                  color: "rgba(255,255,255,0.9)",
                                  fontSize: "0.95rem",
                                  lineHeight: 1.5,
                                  textAlign: r.ltr && isRtl ? "right" : undefined,
                                }}
                              >
                                {r.value}
                              </span>
                            </span>
                          </>
                        );
                        return r.href ? (
                          <a key={i} href={r.href} className="flex items-start gap-4 group">
                            {inner}
                          </a>
                        ) : (
                          <div key={i} className="flex items-start gap-4">
                            {inner}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-7 flex flex-wrap gap-2.5">
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="fe-btn fe-btn-primary"
                        style={{ padding: "0.7rem 1.15rem", fontSize: 13 }}
                      >
                        <Phone size={15} /> {c.call}
                      </a>
                      <a
                        href={`https://wa.me/${contactInfo.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fe-btn fe-btn-ghost"
                        style={{ padding: "0.7rem 1.15rem", fontSize: 13 }}
                      >
                        <MessageCircle size={15} /> {c.whatsapp}
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div
                  className="fe-frame fe-ticks"
                  style={{
                    aspectRatio: "16/11",
                    borderRadius: "var(--fe-r-lg)",
                    border: "1px solid var(--fe-line)",
                  }}
                >
                  <iframe
                    title="Future Earth Energy Systems — Riyadh office location"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(contactInfo.mapsQuery)}&output=embed`}
                    className="w-full h-full"
                    style={{ border: 0, filter: "grayscale(0.2) contrast(1.05)" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </Reveal>
            </div>

            {/* AI Lead Qualification Assistant */}
            <Reveal delay={0.15}>
              <LeadAssistant locale={locale} />
            </Reveal>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
