// Lightweight semantic-ish retrieval over the curated FAQ.
//
// This fast, dependency-free lexical ranker is the retrieval behind the chat:
//   1) it selects the few FAQ entries relevant to a message (see `buildGrounding`),
//   2) it yields a confidence signal (is the message even close to the KB?), and
//   3) it powers analytics — mapping a free-text question to its nearest FAQ entry.

import { faqEntries } from "./faq.generated";
import type { FaqEntry } from "./types";
import { normalize, tokenize } from "./normalize";

interface IndexedEntry {
  entry: FaqEntry;
  qNorm: string;
  qTokens: Set<string>;
  allTokens: Set<string>; // question + answer, for recall
}

let INDEX: IndexedEntry[] | null = null;

function getIndex(): IndexedEntry[] {
  if (INDEX) return INDEX;
  INDEX = faqEntries.map((entry) => ({
    entry,
    qNorm: normalize(entry.question),
    qTokens: new Set(tokenize(entry.question)),
    allTokens: new Set([...tokenize(entry.question), ...tokenize(entry.answer)]),
  }));
  return INDEX;
}

function intersectionSize(a: Set<string>, b: Set<string>): number {
  let n = 0;
  for (const x of a) if (b.has(x)) n++;
  return n;
}

export type Confidence = "high" | "medium" | "low";

export interface FaqMatch {
  entry: FaqEntry;
  /** Combined relevance score in [0,1]. */
  score: number;
}

export interface SearchResult {
  matches: FaqMatch[];
  top: FaqMatch | null;
  confidence: Confidence;
}

const HIGH = 0.58;
const MEDIUM = 0.32;

/**
 * Rank FAQ entries against a free-text query. Combines query-coverage (how much
 * of the question is explained by an entry), Jaccard similarity, and a phrase
 * bonus for near-exact matches.
 */
export function searchFaq(query: string, limit = 3): SearchResult {
  const qTokens = tokenize(query);
  const qSet = new Set(qTokens);
  const qNorm = normalize(query);

  if (qSet.size === 0) return { matches: [], top: null, confidence: "low" };

  const scored: FaqMatch[] = getIndex().map(({ entry, qNorm: eNorm, qTokens: eq, allTokens }) => {
    const interQ = intersectionSize(qSet, eq);
    const coverage = interQ / qSet.size; // share of query explained by the question
    const union = qSet.size + eq.size - interQ;
    const jaccard = union > 0 ? interQ / union : 0;
    const recall = intersectionSize(qSet, allTokens) / qSet.size; // includes answer text
    const phrase = eNorm && (eNorm.includes(qNorm) || qNorm.includes(eNorm)) ? 0.25 : 0;

    const score = Math.min(1, 0.5 * coverage + 0.3 * jaccard + 0.2 * recall + phrase);
    return { entry, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const matches = scored.filter((m) => m.score > 0).slice(0, limit);
  const top = matches[0] ?? null;
  const confidence: Confidence = !top ? "low" : top.score >= HIGH ? "high" : top.score >= MEDIUM ? "medium" : "low";

  return { matches, top, confidence };
}
