// Builds Gemini system instructions from the editable `leadConfig`.
// Core logic lives here once; the conversation content lives in config.ts.

import type { Locale } from "@/content/site";
import { LEAD_COMPLETE_MARKER } from "@/features/lead/types";
import { leadConfig, type Localized } from "./config";
import { scoringRubric } from "./scoring";
import { buildFlowOutline } from "@/server/kb";

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
    "YOU HAVE TWO JOBS, woven into one natural conversation:",
    "  (A) ANSWER the visitor's questions using ONLY approved knowledge. When their",
    "      message is answerable, the relevant Q&A entries are supplied inline with it",
    "      under a 'Relevant approved knowledge' heading — rely on those.",
    "  (B) QUALIFY the visitor by gently gathering the information listed further down,",
    "      so the sales team can prepare a proposal. Let (A) and (B) flow together —",
    "      answer what they ask, then move the qualification forward with one question.",
    "",
    "ANSWERING RULES:",
    "- Answer a question ONLY from the approved knowledge provided with the visitor's message, in your own warm words, in the visitor's language.",
    "- Do NOT invent facts, prices, figures, incentives, or timelines beyond that approved knowledge.",
    "- If no approved knowledge accompanies their question, or you are not confident, DO NOT guess. Say so briefly and hand off:",
    "  offer to connect them with the human team on WhatsApp, or take their contact details so a specialist follows up.",
    "  Never fabricate an answer to seem helpful — an honest handoff is the correct behavior.",
    "",
    // ── (B) Qualification ─────────────────────────────────────────────────────
    "INFORMATION TO GATHER (adapt to the flow; roughly follow these stages):",
    buildFlowOutline(),
    "",
    "DATA POINTS TO CAPTURE:",
    objectives,
    "",
    "RULES OF THE CONVERSATION:",
    "- Ask ONE question at a time. Never bundle multiple questions into a single message.",
    "- Keep each message short (1–3 sentences). Warm, professional, human — never robotic or salesy.",
    "- Briefly acknowledge the visitor's previous answer before asking the next question.",
    "- If an answer is vague, ask a light follow-up rather than moving on — but don't interrogate.",
    "- Skip or soften optional items if the visitor seems reluctant. Never repeat a question they've already answered.",
    "- Do not output lists, headings, JSON, or markdown. Reply as a person would in a chat.",
    "",
    "FINISHING:",
    `- Once you have gathered the REQUIRED items, write a short closing message. ${closing}`,
    `- Then, on a NEW LINE at the very end of that final message, output the exact token ${LEAD_COMPLETE_MARKER} and nothing after it. Output this token ONLY in your final closing message — never earlier.`,
  ].join("\n");
}

/** The lead-profile fields we ask the model to extract from the transcript. */
const PROFILE_FIELDS = [
  "fullName", "company", "businessType", "industry", "country", "city",
  "email", "phone", "preferredContact", "projectType", "budget", "timeline",
  "goals", "painPoints", "currentSolution", "notes",
] as const;

/** System prompt for the structured analysis pass over the full transcript.
 *  The model does qualitative extraction + per-criterion judgment only; the
 *  engine computes the score/tier from the rubric (server/lead/scoring.ts). */
export function buildAnalysisSystemPrompt(locale: Locale): string {
  const lang = locale === "ar" ? "Arabic" : "English";
  const criteria = scoringRubric.criteria
    .map((c) => `- ${c.id} — ${pick(c.label, locale)} (worth ${c.points}): ${pick(c.guidance, locale)}`)
    .join("\n");

  return [
    "You are a senior sales-operations analyst for Future Earth Energy Systems (solar + storage EPC, Saudi Arabia).",
    "You are given a full conversation between the company's AI consultant and a prospective client.",
    "Return a rigorous lead assessment as JSON matching the provided schema. Base EVERYTHING strictly on what was said — never fabricate.",
    "",
    "1) EXTRACT the lead profile into `profile`. Include a field ONLY if the visitor actually provided it; otherwise leave it empty. Do not guess.",
    "",
    "2) SCORE each criterion in `scores` as a number from 0 to 1 (1 = clearly met, 0.5 = partially/implied, 0 = not met or unknown). Judge honestly; missing information means a LOW factor, not a guess:",
    criteria,
    "",
    `3) WRITE "summary", "insights", "recommendedAction" and "buyingIntent" in ${lang}.`,
    "- 'summary' — 2–3 sentences: who they are, what they need, and how ready they are to buy.",
    "- 'insights' — 3–6 crisp, action-oriented bullets for the sales team (needs, urgency, risks, opportunities, missing info).",
    "- 'buyingIntent' — one short line reading their intent to purchase (e.g. high / exploring / early research), with why.",
    "- 'recommendedAction' — one concrete next step for the sales rep.",
    "",
    "Do NOT output an overall score or tier — those are computed from your per-criterion factors.",
  ].join("\n");
}

/** Build the analysis JSON schema from the scoring rubric + profile fields, so
 *  editing the rubric automatically keeps the schema in sync. */
function buildAnalysisSchema() {
  const profileProps: Record<string, { type: "string" }> = {};
  for (const f of PROFILE_FIELDS) profileProps[f] = { type: "string" };

  const scoreProps: Record<string, { type: "number" }> = {};
  for (const c of scoringRubric.criteria) scoreProps[c.id] = { type: "number" };

  return {
    type: "object",
    properties: {
      summary: { type: "string" },
      profile: { type: "object", properties: profileProps },
      scores: {
        type: "object",
        properties: scoreProps,
        required: scoringRubric.criteria.map((c) => c.id),
      },
      buyingIntent: { type: "string" },
      insights: { type: "array", items: { type: "string" } },
      recommendedAction: { type: "string" },
    },
    required: ["summary", "profile", "scores", "insights", "recommendedAction"],
  } as const;
}

/** JSON schema (Gemini/OpenAPI subset) for the analysis response. */
export const analysisResponseSchema = buildAnalysisSchema();
