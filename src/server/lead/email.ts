// Provider-agnostic email dispatch for qualified-lead notifications (server-only).
//
// Mirrors the WhatsApp module: one `EmailProvider` interface, concrete providers
// selected at runtime from env, so the app is never coupled to a vendor. All
// providers are dependency-free (plain fetch). Default is "log" (console only),
// so the feature ships working and starts sending the moment a key is added.
//
//   EMAIL_PROVIDER = log | resend | web3forms | webhook   (default log)
//   EMAIL_TO       = contact@fe-ksa.com                   (destination)
//   EMAIL_MIN_SCORE= 80                                   (only email leads ≥ this)
//
// Providers & their keys:
//   resend    → RESEND_API_KEY, EMAIL_FROM (verify fe-ksa.com in Resend to send
//               to contact@fe-ksa.com; clean HTML email).
//   web3forms → WEB3FORMS_ACCESS_KEY (free, no domain; emails the address that
//               owns the access key — set that to contact@fe-ksa.com).
//   webhook   → EMAIL_WEBHOOK_URL, EMAIL_WEBHOOK_TOKEN (your own mailer).

import { env } from "../env";
import { buildLeadEmail, type EmailInput } from "./email-template";

const DEFAULT_TO = "contact@fe-ksa.com";

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailResult {
  ok: boolean;
  id?: string;
  error?: string;
  /** True when the lead was below the notification threshold (not an error). */
  skipped?: boolean;
}

interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<EmailResult>;
}

// ── Providers ────────────────────────────────────────────────────────────────

/** Dev fallback: logs the email. Always "succeeds". */
class LogEmailProvider implements EmailProvider {
  name = "log";
  async send(message: EmailMessage): Promise<EmailResult> {
    console.info(
      `[email:log] → ${message.to}\nSubject: ${message.subject}\n${"─".repeat(48)}\n${message.text}\n${"─".repeat(48)}`,
    );
    return { ok: true, id: "logged" };
  }
}

/** Resend (https://resend.com) — clean HTML email, generous free tier. */
class ResendProvider implements EmailProvider {
  name = "resend";
  async send(message: EmailMessage): Promise<EmailResult> {
    const key = env("RESEND_API_KEY");
    const from = env("EMAIL_FROM", "Future Earth Leads <onboarding@resend.dev>");
    if (!key) return { ok: false, error: "RESEND_API_KEY not set" };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
      }),
    });
    const data = await safeJson(res);
    if (!res.ok) return { ok: false, error: `Resend ${res.status}: ${JSON.stringify(data)}` };
    return { ok: true, id: typeof data?.id === "string" ? data.id : undefined };
  }
}

/** Web3Forms (https://web3forms.com) — free, no domain needed. Emails the
 *  address that owns the access key; set that to the sales inbox. */
class Web3FormsProvider implements EmailProvider {
  name = "web3forms";
  async send(message: EmailMessage): Promise<EmailResult> {
    const key = env("WEB3FORMS_ACCESS_KEY");
    if (!key) return { ok: false, error: "WEB3FORMS_ACCESS_KEY not set" };

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: message.subject,
        from_name: "Future Earth AI Assistant",
        // Web3Forms renders submitted fields; send the plain-text summary + html.
        message: message.text,
        html: message.html,
      }),
    });
    const data = await safeJson(res);
    if (!res.ok || data?.success === false) {
      return { ok: false, error: `Web3Forms ${res.status}: ${JSON.stringify(data)}` };
    }
    return { ok: true, id: "web3forms" };
  }
}

/** Generic webhook — POST the full payload to your own mailer/CRM. */
class WebhookEmailProvider implements EmailProvider {
  name = "webhook";
  async send(message: EmailMessage): Promise<EmailResult> {
    const url = env("EMAIL_WEBHOOK_URL");
    if (!url) return { ok: false, error: "EMAIL_WEBHOOK_URL not set" };
    const token = env("EMAIL_WEBHOOK_TOKEN");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(message),
    });
    if (!res.ok) return { ok: false, error: `Webhook ${res.status}: ${await safeText(res)}` };
    return { ok: true, id: "webhook" };
  }
}

function resolveProvider(): EmailProvider {
  switch (env("EMAIL_PROVIDER", "log").toLowerCase()) {
    case "resend":
      return new ResendProvider();
    case "web3forms":
      return new Web3FormsProvider();
    case "webhook":
      return new WebhookEmailProvider();
    default:
      return new LogEmailProvider();
  }
}

/** Minimum score that triggers an email (configurable; default 80). */
function minScore(): number {
  const n = Number(env("EMAIL_MIN_SCORE", "80"));
  return Number.isFinite(n) ? n : 80;
}

/**
 * Send the qualified-lead notification email — but only when the lead's score
 * meets the configured threshold. Below it, returns `{ ok: true, skipped: true }`
 * so the caller can record that no email was warranted.
 */
export async function notifyLeadEmail(input: EmailInput): Promise<EmailResult> {
  if (input.analysis.score < minScore()) return { ok: true, skipped: true };

  const to = env("EMAIL_TO", DEFAULT_TO);
  const provider = resolveProvider();
  const { subject, html, text } = buildLeadEmail(input);
  try {
    const result = await provider.send({ to, subject, html, text });
    if (!result.ok) console.error(`[email:${provider.name}] send failed:`, result.error);
    return result;
  } catch (err) {
    console.error(`[email:${provider.name}] send threw:`, err);
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
