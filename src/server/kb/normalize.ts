// Text normalization for knowledge-base matching.
//
// Arabic is written many ways for the same word (diacritics, alef/hamza/ya/ta
// variants, tatweel elongation, Arabic-Indic digits). To match a visitor's
// free-text question against the curated FAQ we fold all of those to a canonical
// form. This is applied to BOTH the stored questions and the incoming query, so
// "كَم أوفّر؟" and "كم اوفر" collapse to the same tokens.

/** Combining marks / harakat / Quranic annotation signs, plus superscript alef. */
const DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۜ۟-۪ۨ-ۭ]/g;
const TATWEEL = /ـ/g;
// Punctuation (Arabic + Latin) → space. Keeps letters and digits only.
const PUNCT = /[!-/:-@[-`{-~«»؛،؟٫٬…ـ"'()]+/g;

/** Map Arabic-Indic (٠-٩) and Extended (۰-۹) digits to ASCII. */
function foldDigits(s: string): string {
  return s.replace(/[٠-٩۰-۹]/g, (d) => {
    const code = d.charCodeAt(0);
    const base = code >= 0x06f0 ? 0x06f0 : 0x0660;
    return String(code - base);
  });
}

/**
 * Canonicalize text for matching: strip diacritics/tatweel, unify Arabic letter
 * variants, fold digits, lowercase Latin, and collapse punctuation/whitespace.
 * Never used for display — the original text is always preserved separately.
 */
export function normalize(input: string): string {
  return foldDigits(input)
    .replace(DIACRITICS, "")
    .replace(TATWEEL, "")
    .replace(/[أإآٱ]/g, "ا") // alef variants → bare alef
    .replace(/ى/g, "ي") // alef maqsura → ya
    .replace(/ؤ/g, "و") // hamza-on-waw → waw
    .replace(/ئ/g, "ي") // hamza-on-ya → ya
    .replace(/ء/g, "") // standalone hamza → drop
    .replace(/ة/g, "ه") // ta marbuta → ha
    .replace(/گ/g, "ك")
    .replace(/پ/g, "ب")
    .replace(/چ/g, "ج")
    .replace(/ژ/g, "ز")
    .replace(/ڤ|ﭪ/g, "ف")
    .toLowerCase()
    .replace(PUNCT, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Very small stop-word set — high-frequency words that carry little signal. */
const STOPWORDS = new Set([
  // Arabic
  "هل", "من", "في", "على", "الى", "او", "و", "ما", "هي", "هو", "عن", "مع", "ان",
  "اذا", "كان", "يكون", "هذا", "هذه", "ذلك", "التي", "الذي", "ثم", "قد", "لا", "ال",
  "به", "به", "لي", "لك", "به", "بعد", "قبل", "كل", "اي", "عند",
  // English
  "the", "a", "an", "is", "are", "do", "does", "to", "of", "in", "on", "for",
  "and", "or", "i", "you", "it", "my", "your", "can", "will", "how", "what",
]);

/** Split normalized text into meaningful tokens (stop-words removed, len ≥ 2). */
export function tokenize(input: string): string[] {
  return normalize(input)
    .split(" ")
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));
}
