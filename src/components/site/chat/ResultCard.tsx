// The confirmation view shown once the conversation completes. Scoring,
// qualification tier, and internal notes are for the sales team only (see the
// lead-notification email) — the customer only ever sees a thank-you message
// and a way to reach us directly. Shared by the floating widget and the
// Contact panel.

import { CheckCircle2, MessageCircle, Phone, RotateCcw } from "lucide-react";
import { contactInfo, leadAssistant, type Locale } from "@/content/site";
import type { LeadAnalysis } from "@/features/lead/types";

export function ResultCard({
  locale,
  onRestart,
}: {
  locale: Locale;
  /** Accepted for API symmetry with the caller — intentionally not rendered. */
  analysis: LeadAnalysis;
  onRestart: () => void;
}) {
  const t = leadAssistant[locale];

  return (
    <div className="fe-la-result" style={{ textAlign: "center" }}>
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "var(--fe-grad-sun)",
          color: "#221200",
          display: "grid",
          placeItems: "center",
          margin: "0 auto",
        }}
      >
        <CheckCircle2 size={30} />
      </div>

      <div className="fe-eyebrow no-tick mt-4" style={{ color: "var(--fe-green)" }}>
        {t.doneEyebrow}
      </div>
      <h3
        className="fe-display mt-3"
        style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--fe-navy)", lineHeight: 1.25 }}
      >
        {t.doneTitle}
      </h3>
      <p
        className="mt-2.5"
        style={{ color: "var(--fe-slate)", fontSize: "0.95rem", lineHeight: 1.6 }}
      >
        {t.doneSub}
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-2.5">
        <a
          href={`https://wa.me/${contactInfo.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fe-btn fe-btn-green"
          style={{ padding: "0.85rem 1.4rem", fontSize: 14 }}
        >
          <MessageCircle size={16} /> {t.talkNow}
        </a>
        <a
          href={`tel:${contactInfo.phone}`}
          className="fe-btn fe-btn-outline"
          style={{ padding: "0.85rem 1.4rem", fontSize: 14 }}
        >
          <Phone size={15} /> {t.callNow}
        </a>
      </div>

      <button type="button" onClick={onRestart} className="fe-link mt-6" style={{ fontSize: 13 }}>
        <RotateCcw size={13} /> {t.newChat}
      </button>

      <div
        className="mt-5 inline-flex items-center gap-2"
        style={{ fontSize: 12.5, color: "var(--fe-green)" }}
      >
        <CheckCircle2 size={14} /> {t.notifiedNote}
      </div>
    </div>
  );
}
