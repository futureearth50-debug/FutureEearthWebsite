// ═══════════════════════════════════════════════════════════════════════════
//  LEAD SCORING — CONFIGURABLE RUBRIC
// ═══════════════════════════════════════════════════════════════════════════
//
//  THIS is the file the client edits to change how leads are scored. It is pure
//  DATA: a list of weighted criteria + the tier thresholds. Nothing else needs
//  to change — the analysis prompt, the JSON schema, and the score computation
//  are all derived from this rubric automatically.
//
//  How scoring works (why it's reliable):
//    • The AI does ONLY qualitative judgment — for each criterion it returns a
//      "met factor" from 0 to 1 (1 = clearly met, 0.5 = partial, 0 = not/unknown).
//    • The ENGINE does the arithmetic: score = Σ (points × factor), clamped 0–100.
//      LLMs are unreliable at maths; this keeps scoring deterministic + auditable.
//    • The tier (Hot/Warm/Cold) is derived from the thresholds below.
//
//  To change scoring: edit `points`, add/remove a criterion, or move a threshold.
//  Everything downstream updates on the next request.
// ═══════════════════════════════════════════════════════════════════════════

import type { Localized } from "./config";
import type { Qualification } from "@/features/lead/types";

export interface ScoringCriterion {
  /** Stable id — also used as the JSON key the model fills in. */
  id: string;
  /** Human-readable name, shown in the score breakdown (both locales). */
  label: Localized;
  /** Max points awarded when fully met. */
  points: number;
  /** Tells the model what "met" means for this criterion. */
  guidance: Localized;
}

export interface ScoringRubric {
  criteria: ScoringCriterion[];
  /** score ≥ hot → Hot; ≥ warm → Warm; otherwise Cold. */
  tiers: { hot: number; warm: number };
}

export const scoringRubric: ScoringRubric = {
  criteria: [
    {
      id: "decisionMaker",
      points: 25,
      label: { en: "Decision maker", ar: "متخذ القرار" },
      guidance: {
        en: "The visitor is the decision-maker or has clear influence/authority over the purchase (owner, exec, facilities/procurement lead).",
        ar: "الزائر هو متخذ القرار أو لديه تأثير/صلاحية واضحة على الشراء (مالك، تنفيذي، مسؤول مرافق/مشتريات).",
      },
    },
    {
      id: "largeCompany",
      points: 20,
      label: { en: "Company / project size", ar: "حجم الشركة أو المشروع" },
      guidance: {
        en: "A sizable organization or large project scale — industrial/commercial, multi-site, or a large system (hundreds of kW to MW).",
        ar: "منشأة كبيرة أو مشروع واسع النطاق — صناعي/تجاري، متعدد المواقع، أو نظام كبير (مئات الكيلوواط إلى ميجاواط).",
      },
    },
    {
      id: "qualifiedBudget",
      points: 20,
      label: { en: "Qualified budget", ar: "ميزانية مؤهَّلة" },
      guidance: {
        en: "Has an allocated budget or clear financing intent appropriate to the project (or is open to a PPA/financing model).",
        ar: "لديه ميزانية مخصّصة أو نية تمويل واضحة تناسب المشروع (أو منفتح على نموذج اتفاقية شراء طاقة/تمويل).",
      },
    },
    {
      id: "urgentTimeline",
      points: 15,
      label: { en: "Urgent timeline", ar: "إطار زمني عاجل" },
      guidance: {
        en: "Wants to move soon — now or within roughly three months (not just exploring for the distant future).",
        ar: "يرغب بالبدء قريباً — الآن أو خلال ثلاثة أشهر تقريباً (وليس مجرد استكشاف لمستقبل بعيد).",
      },
    },
    {
      id: "clearNeed",
      points: 10,
      label: { en: "Clear business need", ar: "حاجة واضحة" },
      guidance: {
        en: "A concrete, defined need or project (specific goal, site, or problem to solve) rather than vague curiosity.",
        ar: "حاجة أو مشروع محدد وواضح (هدف أو موقع أو مشكلة بعينها) وليس فضولاً عاماً.",
      },
    },
    {
      id: "completeContact",
      points: 10,
      label: { en: "Complete contact info", ar: "بيانات تواصل كاملة" },
      guidance: {
        en: "Provided enough to follow up: a name plus at least one reachable channel (email or phone). Full = name + email + phone.",
        ar: "قدّم ما يكفي للمتابعة: اسم مع وسيلة تواصل واحدة على الأقل (بريد أو هاتف). الكامل = اسم + بريد + هاتف.",
      },
    },
  ],
  tiers: { hot: 80, warm: 50 },
};

/** Clamp an arbitrary value to a 0..1 "met factor". */
function clampFactor(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

export interface ScoreLine {
  id: string;
  points: number;
  factor: number;
  earned: number;
}

export interface ScoreResult {
  score: number;
  qualification: Qualification;
  lines: ScoreLine[];
}

/**
 * Compute the final 0–100 score and tier from the model's per-criterion factors.
 * `factors` is keyed by criterion id; missing/invalid entries count as 0.
 */
export function computeScore(factors: Record<string, unknown> | undefined): ScoreResult {
  const f = factors ?? {};
  const lines: ScoreLine[] = scoringRubric.criteria.map((c) => {
    const factor = clampFactor(f[c.id]);
    return { id: c.id, points: c.points, factor, earned: Math.round(c.points * factor) };
  });
  const score = Math.max(0, Math.min(100, lines.reduce((sum, l) => sum + l.earned, 0)));
  return { score, qualification: tierFor(score), lines };
}

export function tierFor(score: number): Qualification {
  if (score >= scoringRubric.tiers.hot) return "Hot";
  if (score >= scoringRubric.tiers.warm) return "Warm";
  return "Cold";
}
