// Provider-agnostic WhatsApp dispatch (server-only).
//
// The application talks to a single `WhatsAppProvider` interface. Concrete
// providers (Meta Cloud API, Twilio, a generic webhook for an in-house gateway,
// and a dev "log" provider) are selected at runtime from env — so the app is
// never coupled to one vendor. Add a new provider by implementing the interface
// and registering it in `resolveProvider`.

import { env, envBool } from "../env";
import type { Locale } from "@/content/site";
import type { ChatMessage, LeadAnalysis } from "@/features/lead/types";

export interface WhatsAppMessage {
  /** Destination number, international format, digits only. */
  to: string;
  text: string;
}

export interface WhatsAppResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export interface WhatsAppProvider {
  readonly name: string;
  send(message: WhatsAppMessage): Promise<WhatsAppResult>;
}

// ── Providers ────────────────────────────────────────────────────────────────

/** Dev fallback: logs the message. Always "succeeds". */
class LogProvider implements WhatsAppProvider {
  name = "log";
  async send(message: WhatsAppMessage): Promise<WhatsAppResult> {
    console.info(
      `[whatsapp:log] → ${message.to}\n${"─".repeat(48)}\n${message.text}\n${"─".repeat(48)}`,
    );
    return { ok: true, id: "logged" };
  }
}

/** Meta WhatsApp Cloud API (graph.facebook.com). */
class MetaCloudProvider implements WhatsAppProvider {
  name = "meta";
  async send(message: WhatsAppMessage): Promise<WhatsAppResult> {
    const phoneId = env("WHATSAPP_META_PHONE_NUMBER_ID");
    const token = env("WHATSAPP_META_TOKEN");
    const version = env("WHATSAPP_META_API_VERSION", "v21.0");
    if (!phoneId || !token) return { ok: false, error: "Meta provider not configured" };

    const res = await fetch(`https://graph.facebook.com/${version}/${phoneId}/messages`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: message.to,
        type: "text",
        text: { preview_url: false, body: message.text },
      }),
    });
    const data = await safeJson(res);
    if (!res.ok) return { ok: false, error: `Meta ${res.status}: ${JSON.stringify(data)}` };
    const id = (data?.messages as Array<{ id?: string }> | undefined)?.[0]?.id;
    return { ok: true, id };
  }
}

/** Twilio WhatsApp API. */
class TwilioProvider implements WhatsAppProvider {
  name = "twilio";
  async send(message: WhatsAppMessage): Promise<WhatsAppResult> {
    const sid = env("WHATSAPP_TWILIO_ACCOUNT_SID");
    const token = env("WHATSAPP_TWILIO_AUTH_TOKEN");
    const from = env("WHATSAPP_TWILIO_FROM");
    if (!sid || !token || !from) return { ok: false, error: "Twilio provider not configured" };

    const body = new URLSearchParams({
      From: `whatsapp:+${from.replace(/^\+/, "")}`,
      To: `whatsapp:+${message.to.replace(/^\+/, "")}`,
      Body: message.text,
    });
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        authorization: `Basic ${btoa(`${sid}:${token}`)}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body,
    });
    const data = await safeJson(res);
    if (!res.ok) return { ok: false, error: `Twilio ${res.status}: ${JSON.stringify(data)}` };
    return { ok: true, id: typeof data?.sid === "string" ? data.sid : undefined };
  }
}

/** Generic webhook — POST the payload to an in-house WhatsApp gateway. */
class WebhookProvider implements WhatsAppProvider {
  name = "webhook";
  async send(message: WhatsAppMessage): Promise<WhatsAppResult> {
    const url = env("WHATSAPP_WEBHOOK_URL");
    if (!url) return { ok: false, error: "Webhook provider not configured" };
    const token = env("WHATSAPP_WEBHOOK_TOKEN");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ to: message.to, text: message.text }),
    });
    if (!res.ok) return { ok: false, error: `Webhook ${res.status}: ${await safeText(res)}` };
    return { ok: true, id: "webhook" };
  }
}

function resolveProvider(): WhatsAppProvider {
  switch (env("WHATSAPP_PROVIDER", "log").toLowerCase()) {
    case "meta":
      return new MetaCloudProvider();
    case "twilio":
      return new TwilioProvider();
    case "webhook":
      return new WebhookProvider();
    default:
      return new LogProvider();
  }
}

// ── Message formatting + high-level dispatch ─────────────────────────────────

const TIER_ICON: Record<LeadAnalysis["qualification"], string> = {
  Hot: "🔥",
  Warm: "🌤️",
  Cold: "❄️",
};

export function buildLeadMessage(args: {
  leadId: string;
  locale: Locale;
  analysis: LeadAnalysis;
  messages: ChatMessage[];
}): string {
  const { leadId, locale, analysis, messages } = args;
  const p = analysis.profile;
  const lines: string[] = [];
  const loc = [p.city, p.country].filter(Boolean).join(", ");

  lines.push(
    `${TIER_ICON[analysis.qualification]} *New Lead — ${analysis.qualification}* (${analysis.score}/100)`,
  );
  lines.push(`Future Earth · AI Lead Qualification · ${leadId}`);
  lines.push("");
  if (p.fullName) lines.push(`👤 *Name:* ${p.fullName}`);
  if (p.company) lines.push(`🏢 *Company:* ${p.company}${p.businessType ? ` — ${p.businessType}` : ""}`);
  if (p.industry) lines.push(`🏭 *Industry:* ${p.industry}`);
  if (p.phone) lines.push(`📱 *Phone:* ${p.phone}`);
  if (p.email) lines.push(`✉️ *Email:* ${p.email}`);
  if (p.preferredContact) lines.push(`☎️ *Prefers:* ${p.preferredContact}`);
  if (loc) lines.push(`📍 *Location:* ${loc}`);
  if (p.projectType) lines.push(`⚡ *Project:* ${p.projectType}`);
  if (p.timeline) lines.push(`🗓️ *Timeline:* ${p.timeline}`);
  if (p.budget) lines.push(`💰 *Budget:* ${p.budget}`);
  if (p.goals) lines.push(`🎯 *Goals:* ${p.goals}`);
  if (p.painPoints) lines.push(`⚠️ *Pain points:* ${p.painPoints}`);
  if (p.currentSolution) lines.push(`🔧 *Current solution:* ${p.currentSolution}`);
  lines.push("");
  if (analysis.buyingIntent) lines.push(`📈 *Buying intent:* ${analysis.buyingIntent}`);
  lines.push(`📝 *Summary:*\n${analysis.summary}`);
  if (analysis.insights.length) {
    lines.push("");
    lines.push("🔎 *Insights:*");
    for (const i of analysis.insights) lines.push(`• ${i}`);
  }
  if (analysis.recommendedAction) {
    lines.push("");
    lines.push(`✅ *Next step:* ${analysis.recommendedAction}`);
  }

  if (envBool("WHATSAPP_INCLUDE_TRANSCRIPT", true)) {
    lines.push("");
    lines.push(`💬 *Transcript (${locale.toUpperCase()}):*`);
    for (const m of messages) {
      const who = m.role === "assistant" ? "AI" : "Lead";
      lines.push(`— *${who}:* ${m.content}`);
    }
  }

  return lines.join("\n");
}

/** Format + dispatch the lead notification to the sales WhatsApp number. */
export async function notifySales(args: {
  leadId: string;
  locale: Locale;
  analysis: LeadAnalysis;
  messages: ChatMessage[];
}): Promise<WhatsAppResult> {
  const to = env("WHATSAPP_SALES_NUMBER", "966118108828");
  const provider = resolveProvider();
  const text = buildLeadMessage(args);
  try {
    const result = await provider.send({ to, text });
    if (!result.ok) console.error(`[whatsapp:${provider.name}] send failed:`, result.error);
    return result;
  } catch (err) {
    console.error(`[whatsapp:${provider.name}] send threw:`, err);
    return { ok: false, error: String(err) };
  }
}

async function safeJson(res: Response): Promise<Record<string, unknown> | null> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}
async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 300);
  } catch {
    return "<no body>";
  }
}
