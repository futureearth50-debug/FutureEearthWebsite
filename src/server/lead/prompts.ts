// Builds Gemini system instructions from the editable `leadConfig`.
// Core logic lives here once; the conversation content lives in config.ts.

import type { Locale } from "@/content/site";
import { LEAD_COMPLETE_MARKER } from "@/features/lead/types";
import { leadConfig, type Localized } from "./config";

function pick(value: Localized, locale: Locale): string {
  return value[locale];
}

function objectivesList(locale: Locale): string {
  return leadConfig.objectives
    .map((o, i) => {
      const req = o.required
        ? locale === "ar"
          ? " (مطلوب)"
          : " (required)"
        : locale === "ar"
          ? " (اختياري)"
          : " (optional)";
      return `${i + 1}. ${pick(o.label, locale)}${req} — ${pick(o.goal, locale)}`;
    })
    .join("\n");
}

/** System prompt that drives the live, one-question-at-a-time conversation. */
export function buildChatSystemPrompt(locale: Locale): string {
  const lang = locale === "ar" ? "Arabic" : "English";
  const objectives = objectivesList(locale);
  const persona = pick(leadConfig.persona, locale);
  const closing = pick(leadConfig.closing, locale);

  return [
    persona,
    "",
    `LANGUAGE: Converse entirely in ${lang}. Mirror the visitor if they clearly switch languages.`,
    "",
    "YOUR GOAL: Have a natural, consultative conversation to gather the information below, so the sales team can qualify and prepare a proposal.",
    "",
    "INFORMATION TO GATHER (in roughly this order, but adapt to the flow):",
    objectives,
    "",
    "RULES OF THE CONVERSATION:",
    "- Ask ONE question at a time. Never bundle multiple questions into a single message.",
    "- Keep each message short (1–3 sentences). Warm, professional, human — never robotic or salesy.",
    "- Briefly acknowledge the visitor's previous answer before asking the next question.",
    "- If an answer is vague, ask a light follow-up rather than moving on — but don't interrogate.",
    "- Do not invent facts about pricing, incentives, or timelines. If asked something you can't commit to, say the engineering team will confirm.",
    "- Skip or soften optional items if the visitor seems reluctant. Never repeat a question they've already answered.",
    "- Do not output lists, headings, JSON, or markdown. Reply as a person would in a chat.",
    "",
    "FINISHING:",
    `- Once you have gathered the REQUIRED items above, write a short closing message. ${closing}`,
    `- Then, on a NEW LINE at the very end of that final message, output the exact token ${LEAD_COMPLETE_MARKER} and nothing after it. Output this token ONLY in your final closing message — never earlier.`,
  ].join("\n");
}

/** System prompt for the structured analysis pass over the full transcript. */
export function buildAnalysisSystemPrompt(locale: Locale): string {
  const tiers = leadConfig.qualification.tiers
    .map((t) => `- ${t.id} (${pick(t.label, locale)}): ${pick(t.criteria, locale)}`)
    .join("\n");

  return [
    "You are a senior sales-operations analyst for Future Earth Energy Systems (solar + storage EPC, Saudi Arabia).",
    "You are given a full conversation between the company's AI consultant and a prospective client.",
    "Analyze it and return a rigorous lead assessment as JSON matching the provided schema.",
    "",
    "QUALIFICATION TIERS:",
    tiers,
    "",
    "SCORING:",
    pick(leadConfig.qualification.scoringGuidance, locale),
    "",
    "INSTRUCTIONS:",
    `- Write the "summary", "insights", and "recommendedAction" fields in ${locale === "ar" ? "Arabic" : "English"}.`,
    "- Extract contact details only if the visitor actually provided them; otherwise leave those fields empty.",
    "- Base everything strictly on what was said. Do not fabricate. If information is missing, reflect that in a lower score and note it as a gap in the insights.",
    "- 'insights' should be 3–6 crisp, action-oriented bullets that help the sales team (needs, urgency, risks, opportunities, missing info).",
    "- 'recommendedAction' is one concrete next step for the sales rep.",
  ].join("\n");
}

/** JSON schema (Gemini/OpenAPI subset) for the analysis response. */
export const analysisResponseSchema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    qualification: { type: "string", enum: ["Hot", "Warm", "Cold"] },
    score: { type: "integer" },
    contact: {
      type: "object",
      properties: {
        name: { type: "string" },
        company: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        role: { type: "string" },
        location: { type: "string" },
      },
    },
    projectType: { type: "string" },
    budget: { type: "string" },
    timeline: { type: "string" },
    insights: { type: "array", items: { type: "string" } },
    recommendedAction: { type: "string" },
  },
  required: ["summary", "qualification", "score", "contact", "insights", "recommendedAction"],
} as const;
