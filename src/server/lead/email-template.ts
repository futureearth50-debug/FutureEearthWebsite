// Renders the qualified-lead notification email (server-only).
//
// Produces a clean, responsive, email-client-safe HTML document (table layout +
// inline styles — the only thing that renders consistently across Gmail/Outlook/
// Apple Mail), plus a plain-text fallback and a subject line. Pure formatting:
// no I/O, no provider logic (that lives in email.ts).

import type { Locale } from "@/content/site";
import type { ChatMessage, LeadAnalysis, LeadMeta } from "@/features/lead/types";

const BRAND = {
  navy: "#0A1B2E",
  navy2: "#0E2740",
  amber: "#F5A623",
  amberDeep: "#E1841A",
  paper: "#FBFCFD",
  line: "#E1E7EF",
  slate: "#51637A",
  slate2: "#7488A0",
  green: "#17976A",
};

const TIER = {
  Hot: { label: "HOT LEAD", color: "#B4380F", bg: "#FDEDE6", icon: "🔥" },
  Warm: { label: "WARM LEAD", color: "#9A6207", bg: "#FEF6E6", icon: "🌤️" },
  Cold: { label: "COLD LEAD", color: "#3E6690", bg: "#EDF2F8", icon: "❄️" },
} as const;

export interface EmailInput {
  leadId: string;
  locale: Locale;
  analysis: LeadAnalysis;
  messages: ChatMessage[];
  meta?: LeadMeta;
  createdAt: string; // ISO
}

/** Escape a value for safe interpolation into HTML. */
function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Light user-agent read for the sales team ("Chrome on Windows · Desktop"). */
function deviceInfo(ua?: string): string {
  if (!ua) return "—";
  const browser =
    /edg/i.test(ua) ? "Edge" :
    /opr|opera/i.test(ua) ? "Opera" :
    /chrome|crios/i.test(ua) ? "Chrome" :
    /firefox|fxios/i.test(ua) ? "Firefox" :
    /safari/i.test(ua) ? "Safari" : "Browser";
  const os =
    /windows/i.test(ua) ? "Windows" :
    /android/i.test(ua) ? "Android" :
    /iphone|ipad|ios/i.test(ua) ? "iOS" :
    /mac os|macintosh/i.test(ua) ? "macOS" :
    /linux/i.test(ua) ? "Linux" : "";
  const kind = /mobile|iphone|android/i.test(ua) ? "Mobile" : "Desktop";
  return `${browser}${os ? " on " + os : ""} · ${kind}`;
}

const rowsFor = (pairs: [string, string | undefined][]) =>
  pairs
    .filter(([, v]) => v && v.trim())
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:7px 0;color:${BRAND.slate2};font-size:13px;width:38%;vertical-align:top;">${esc(label)}</td>
        <td style="padding:7px 0;color:${BRAND.navy};font-size:14px;font-weight:500;vertical-align:top;">${esc(value)}</td>
      </tr>`,
    )
    .join("");

function sectionTitle(text: string): string {
  return `<div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.amberDeep};font-weight:700;margin:0 0 10px;">${esc(text)}</div>`;
}

function breakdownHtml(analysis: LeadAnalysis): string {
  return analysis.breakdown
    .map((b) => {
      const pct = b.points > 0 ? Math.round((b.earned / b.points) * 100) : 0;
      return `
      <tr>
        <td style="padding:5px 0;font-size:13px;color:${BRAND.slate};width:55%;">${esc(b.label)}</td>
        <td style="padding:5px 0;width:35%;">
          <div style="background:${BRAND.line};border-radius:6px;height:8px;width:100%;">
            <div style="background:${BRAND.amber};border-radius:6px;height:8px;width:${pct}%;"></div>
          </div>
        </td>
        <td style="padding:5px 0 5px 10px;font-size:13px;color:${BRAND.navy};font-weight:600;text-align:right;white-space:nowrap;">${b.earned}/${b.points}</td>
      </tr>`;
    })
    .join("");
}

function transcriptHtml(messages: ChatMessage[]): string {
  return messages
    .map((m) => {
      const isAI = m.role === "assistant";
      const who = isAI ? "AI Consultant" : "Prospect";
      const color = isAI ? BRAND.slate : BRAND.navy;
      const bg = isAI ? "#FFFFFF" : BRAND.paper;
      return `
      <div style="margin:0 0 8px;padding:10px 12px;background:${bg};border:1px solid ${BRAND.line};border-radius:8px;">
        <div style="font-size:11px;color:${isAI ? BRAND.amberDeep : BRAND.slate2};font-weight:700;margin-bottom:3px;">${who}</div>
        <div style="font-size:13px;color:${color};line-height:1.5;white-space:pre-wrap;">${esc(m.content)}</div>
      </div>`;
    })
    .join("");
}

export function buildLeadEmail(input: EmailInput): { subject: string; html: string; text: string } {
  const { leadId, analysis, messages, meta, createdAt } = input;
  const p = analysis.profile;
  const tier = TIER[analysis.qualification];
  const when = new Date(createdAt).toUTCString();
  const location = [p.city, p.country].filter(Boolean).join(", ");

  const subject = `${tier.icon} ${analysis.qualification} Lead (${analysis.score}/100)${
    p.company ? ` — ${p.company}` : p.fullName ? ` — ${p.fullName}` : ""
  }`;

  const customer = rowsFor([
    ["Name", p.fullName],
    ["Company", p.company],
    ["Business type", p.businessType],
    ["Industry", p.industry],
    ["Country", p.country],
    ["City", p.city],
    ["Email", p.email],
    ["Phone", p.phone],
    ["Preferred contact", p.preferredContact],
  ]);

  const qualification = rowsFor([
    ["Project type", p.projectType],
    ["Budget", p.budget],
    ["Timeline", p.timeline],
  ]);

  const summaryBlocks = [
    ["Summary", analysis.summary],
    ["Buying intent", analysis.buyingIntent],
    ["Goals", p.goals],
    ["Pain points", p.painPoints],
    ["Requested services", p.projectType],
    ["Current solution", p.currentSolution],
    ["Recommended next action", analysis.recommendedAction],
  ]
    .filter(([, v]) => v && String(v).trim())
    .map(
      ([label, value]) => `
      <div style="margin:0 0 12px;">
        <div style="font-size:12px;color:${BRAND.slate2};font-weight:600;margin-bottom:2px;">${esc(label as string)}</div>
        <div style="font-size:14px;color:${BRAND.navy};line-height:1.55;">${esc(value as string)}</div>
      </div>`,
    )
    .join("");

  const insights = analysis.insights.length
    ? `<ul style="margin:6px 0 0;padding-inline-start:18px;color:${BRAND.slate};font-size:13px;line-height:1.6;">${analysis.insights
        .map((i) => `<li>${esc(i)}</li>`)
        .join("")}</ul>`
    : "";

  const html = `<!doctype html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:${BRAND.paper};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.paper};padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border:1px solid ${BRAND.line};border-radius:16px;overflow:hidden;">
        <!-- Header -->
        <tr><td style="background:${BRAND.navy};padding:24px;">
          <div style="color:#fff;font-size:18px;font-weight:700;">Future Earth Energy Systems</div>
          <div style="color:rgba(255,255,255,0.6);font-size:12px;margin-top:2px;">AI Lead Qualification · New submission</div>
          <table role="presentation" width="100%" style="margin-top:16px;"><tr>
            <td style="vertical-align:middle;">
              <span style="display:inline-block;background:${tier.bg};color:${tier.color};font-size:12px;font-weight:700;letter-spacing:1px;padding:6px 12px;border-radius:999px;">${tier.icon} ${tier.label}</span>
            </td>
            <td style="text-align:right;vertical-align:middle;">
              <span style="color:#fff;font-size:34px;font-weight:700;">${analysis.score}</span><span style="color:rgba(255,255,255,0.5);font-size:15px;">/100</span>
            </td>
          </tr></table>
        </td></tr>

        <!-- Customer -->
        ${customer ? `<tr><td style="padding:22px 24px 4px;">${sectionTitle("Customer Information")}<table role="presentation" width="100%">${customer}</table></td></tr>` : ""}

        <!-- Qualification -->
        <tr><td style="padding:18px 24px 4px;">
          ${sectionTitle("Qualification")}
          <table role="presentation" width="100%">${qualification}</table>
          <table role="presentation" width="100%" style="margin-top:12px;">${breakdownHtml(analysis)}</table>
        </td></tr>

        <!-- AI Summary -->
        <tr><td style="padding:18px 24px 4px;">
          ${sectionTitle("AI Conversation Summary")}
          ${summaryBlocks}
          ${insights ? `<div style="font-size:12px;color:${BRAND.slate2};font-weight:600;margin:4px 0 0;">Key insights</div>${insights}` : ""}
        </td></tr>

        <!-- Transcript -->
        <tr><td style="padding:18px 24px 4px;">
          ${sectionTitle("Full Transcript")}
          ${transcriptHtml(messages)}
        </td></tr>

        <!-- Meta footer -->
        <tr><td style="padding:16px 24px 26px;">
          <div style="border-top:1px solid ${BRAND.line};padding-top:14px;">
            <table role="presentation" width="100%">
              ${rowsFor([
                ["Lead ID", leadId],
                ["Received", when],
                ["Started on page", meta?.page],
                ["Referrer", meta?.referrer],
                ["Device", deviceInfo(meta?.userAgent)],
              ])}
            </table>
          </div>
        </td></tr>
      </table>
      <div style="color:${BRAND.slate2};font-size:11px;margin-top:14px;">This lead was captured and scored automatically by the Future Earth AI assistant.</div>
    </td></tr>
  </table>
</body>
</html>`;

  // Plain-text fallback
  const textLines = [
    `${analysis.qualification} LEAD — ${analysis.score}/100  [${leadId}]`,
    "",
    "CUSTOMER",
    `  Name: ${p.fullName ?? "—"}`,
    `  Company: ${p.company ?? "—"}${p.businessType ? ` (${p.businessType})` : ""}`,
    `  Industry: ${p.industry ?? "—"}`,
    `  Location: ${location || "—"}`,
    `  Email: ${p.email ?? "—"}`,
    `  Phone: ${p.phone ?? "—"}`,
    `  Preferred: ${p.preferredContact ?? "—"}`,
    "",
    "QUALIFICATION",
    `  Project: ${p.projectType ?? "—"}`,
    `  Budget: ${p.budget ?? "—"}`,
    `  Timeline: ${p.timeline ?? "—"}`,
    ...analysis.breakdown.map((b) => `  ${b.label}: ${b.earned}/${b.points}`),
    "",
    "SUMMARY",
    `  ${analysis.summary}`,
    analysis.buyingIntent ? `  Buying intent: ${analysis.buyingIntent}` : "",
    analysis.recommendedAction ? `  Next: ${analysis.recommendedAction}` : "",
    "",
    "TRANSCRIPT",
    ...messages.map((m) => `  [${m.role === "assistant" ? "AI" : "Lead"}] ${m.content}`),
    "",
    `Received: ${when}`,
    meta?.page ? `Page: ${meta.page}` : "",
    meta?.referrer ? `Referrer: ${meta.referrer}` : "",
    `Device: ${deviceInfo(meta?.userAgent)}`,
  ].filter(Boolean);

  return { subject, html, text: textLines.join("\n") };
}
