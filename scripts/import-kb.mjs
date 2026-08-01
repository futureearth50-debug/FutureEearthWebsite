// ═══════════════════════════════════════════════════════════════════════════
//  KNOWLEDGE-BASE IMPORTER  —  knowledge-base/faq.xlsx  →  src/server/kb/faq.generated.ts
// ═══════════════════════════════════════════════════════════════════════════
//
//  Run with:  npm run kb:import
//
//  To update the chatbot's knowledge base, the client simply REPLACES
//  `knowledge-base/faq.xlsx` with a new file (same layout) and re-runs the
//  command. Everything downstream (retrieval, grounding) reads the generated
//  module, so no code changes are needed.
//
//  Dependency-free by design (matches the project's hand-rolled Gemini/WhatsApp
//  clients): a minimal ZIP reader (xlsx is a zip of XML) via node:zlib, plus a
//  small XML extractor. Arabic text is preserved byte-for-byte.
//
//  Expected workbook layout (auto-detected, tolerant of column order):
//    • FAQ sheet   (name contains "العملاء" / "customer"): columns
//        "الأجوبة" (answer)  +  "أسئلة…" (question)  →  one FaqEntry per row.
//    • Flow sheet  (name contains "البوت" / "bot"): first data row holds the
//        welcome message (question col) + newline-separated quick replies
//        (answer col); the remaining label column lists the qualification stages.
// ═══════════════════════════════════════════════════════════════════════════

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "knowledge-base", "faq.xlsx");
const OUT = path.join(ROOT, "src", "server", "kb", "faq.generated.ts");

// ── Minimal ZIP reader ───────────────────────────────────────────────────────
/** Extract all entries from a ZIP buffer → { [filename]: Buffer }. */
function readZip(buf) {
  // Locate End Of Central Directory record (scan back; comment is normally empty).
  const EOCD_SIG = 0x06054b50;
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0 && i >= buf.length - 22 - 0x10000; i--) {
    if (buf.readUInt32LE(i) === EOCD_SIG) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) throw new Error("Not a valid zip/xlsx: EOCD not found");

  const cdCount = buf.readUInt16LE(eocd + 10);
  let ptr = buf.readUInt32LE(eocd + 16); // offset of central directory
  const files = {};

  for (let n = 0; n < cdCount; n++) {
    if (buf.readUInt32LE(ptr) !== 0x02014b50) break; // central-dir header sig
    const method = buf.readUInt16LE(ptr + 10);
    const compSize = buf.readUInt32LE(ptr + 20);
    const fnLen = buf.readUInt16LE(ptr + 28);
    const extraLen = buf.readUInt16LE(ptr + 30);
    const commentLen = buf.readUInt16LE(ptr + 32);
    const localOff = buf.readUInt32LE(ptr + 42);
    const name = buf.toString("utf8", ptr + 46, ptr + 46 + fnLen);

    // Jump to the local header to find where the data actually starts (its
    // filename/extra lengths can differ from the central directory's).
    if (buf.readUInt32LE(localOff) === 0x04034b50) {
      const lFnLen = buf.readUInt16LE(localOff + 26);
      const lExtraLen = buf.readUInt16LE(localOff + 28);
      const dataStart = localOff + 30 + lFnLen + lExtraLen;
      const raw = buf.subarray(dataStart, dataStart + compSize);
      files[name] = method === 0 ? Buffer.from(raw) : zlib.inflateRawSync(raw);
    }
    ptr += 46 + fnLen + extraLen + commentLen;
  }
  return files;
}

// ── Minimal XML helpers ──────────────────────────────────────────────────────
function unescapeXml(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function colToIndex(col) {
  let n = 0;
  for (const ch of col) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

/** Clean a cell value: normalise CRLF→LF and trim outer whitespace (Arabic kept intact). */
function clean(s) {
  return String(s ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

// ── Parse workbook ───────────────────────────────────────────────────────────
function parseWorkbook(files) {
  // Shared strings
  const shared = [];
  const ss = files["xl/sharedStrings.xml"];
  if (ss) {
    const xml = ss.toString("utf8");
    for (const si of xml.match(/<si>[\s\S]*?<\/si>/g) || []) {
      const runs = [...si.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => unescapeXml(m[1]));
      shared.push(runs.join(""));
    }
  }

  // Sheet name → target file (via workbook.xml + rels)
  const wb = files["xl/workbook.xml"].toString("utf8");
  const rels = files["xl/_rels/workbook.xml.rels"].toString("utf8");
  const relMap = {};
  for (const m of rels.matchAll(/<Relationship[^>]*Id="([^"]*)"[^>]*Target="([^"]*)"[^>]*\/>/g)) {
    relMap[m[1]] = m[2].replace(/^\/?xl\//, "").replace(/^\//, "");
  }

  const sheets = [];
  for (const m of wb.matchAll(/<sheet[^>]*\/>/g)) {
    const tag = m[0];
    const name = unescapeXml((tag.match(/name="([^"]*)"/) || [])[1] || "");
    const rid = (tag.match(/r:id="([^"]*)"/) || [])[1];
    const target = relMap[rid];
    if (!name || !target) continue;
    sheets.push({ name, rows: parseSheet(files[`xl/${target}`].toString("utf8"), shared) });
  }
  return sheets;
}

function parseSheet(xml, shared) {
  const rows = [];
  for (const rowM of xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells = [];
    for (const c of rowM[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*)>([\s\S]*?)<\/c>/g)) {
      const idx = colToIndex(c[1]);
      const t = (c[2].match(/t="([^"]*)"/) || [])[1];
      const inner = c[3];
      let val = "";
      if (t === "s") {
        const vi = (inner.match(/<v>(\d+)<\/v>/) || [])[1];
        val = vi != null ? shared[Number(vi)] : "";
      } else if (t === "inlineStr") {
        val = [...inner.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) => unescapeXml(m[1])).join("");
      } else {
        const vm = inner.match(/<v>([\s\S]*?)<\/v>/);
        val = vm ? unescapeXml(vm[1]) : "";
      }
      cells[idx] = val;
    }
    rows.push(cells);
  }
  return rows;
}

// ── Interpret sheets into FAQ + flow ─────────────────────────────────────────
const looksLikeAnswerHeader = (s) => /الأجوب|answer/i.test(s || "");
const looksLikeQuestionHeader = (s) => /سؤال|أسئلة|question/i.test(s || "");

function findHeaderRow(rows) {
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    const r = rows[i] || [];
    if (r.some(looksLikeAnswerHeader) || r.some(looksLikeQuestionHeader)) return i;
  }
  return 0;
}

/** Pull (question, answer) pairs from a sheet using its header to map columns. */
function extractFaq(sheet, idPrefix) {
  const { name, rows } = sheet;
  const h = findHeaderRow(rows);
  const header = rows[h] || [];
  let answerCol = header.findIndex(looksLikeAnswerHeader);
  let questionCol = header.findIndex(looksLikeQuestionHeader);
  // Fallback: the two right-most populated columns (answer left of question in this file).
  if (answerCol === -1 || questionCol === -1) {
    const populated = header.map((v, i) => [i, v]).filter(([, v]) => v).map(([i]) => i);
    questionCol = populated[populated.length - 1] ?? 8;
    answerCol = populated[populated.length - 2] ?? 7;
  }
  const entries = [];
  for (let i = h + 1; i < rows.length; i++) {
    const q = clean(rows[i]?.[questionCol]);
    const a = clean(rows[i]?.[answerCol]);
    if (!q || !a) continue;
    entries.push({ id: `${idPrefix}-${entries.length + 1}`, question: q, answer: a, sheet: name });
  }
  return { entries, answerCol, questionCol };
}

/** Pull welcome / quick-replies / stage labels from the bot flow sheet. */
function extractFlow(sheet) {
  const { rows } = sheet;
  const h = findHeaderRow(rows);
  const header = rows[h] || [];
  let answerCol = header.findIndex(looksLikeAnswerHeader);
  let questionCol = header.findIndex(looksLikeQuestionHeader);
  if (answerCol === -1) answerCol = 6;
  if (questionCol === -1) questionCol = 7;

  const data = rows.slice(h + 1).filter((r) => (r || []).some((c) => clean(c)));
  const first = data[0] || [];
  const welcome = clean(first[questionCol]);
  const quickReplies = clean(first[answerCol])
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  // The stage label lives in whichever column is NOT question/answer and holds
  // text (the numeric "expected answer" cells for later stages are ignored).
  const labelCol = Math.max(questionCol, answerCol) + 1;
  const stages = [];
  data.forEach((r, i) => {
    const label = clean(r[labelCol]);
    if (label) stages.push({ id: `stage-${i}`, label, order: i });
  });
  return { welcome, quickReplies, stages };
}

// ── Codegen ──────────────────────────────────────────────────────────────────
const j = (v) => JSON.stringify(v);

function generate(faq, flow, meta) {
  const faqLines = faq
    .map((e) => `  { id: ${j(e.id)}, sheet: ${j(e.sheet)}, question: ${j(e.question)}, answer: ${j(e.answer)} },`)
    .join("\n");
  const stageLines = flow.stages
    .map((s) => `    { id: ${j(s.id)}, order: ${s.order}, label: ${j(s.label)} },`)
    .join("\n");
  const quickLines = flow.quickReplies.map((q) => `    ${j(q)},`).join("\n");

  return `// ⚠️  AUTO-GENERATED by scripts/import-kb.mjs — DO NOT EDIT BY HAND.
//     Source: ${meta.source}
//     Regenerate: npm run kb:import
//     Generated: ${meta.generatedAt}
//
// Arabic content is preserved exactly as authored in the Excel workbook.

import type { FaqEntry, ConversationFlow, KbMeta } from "./types";

export const faqEntries: FaqEntry[] = [
${faqLines}
];

export const conversationFlow: ConversationFlow = {
  welcome: ${j(flow.welcome)},
  quickReplies: [
${quickLines}
  ],
  stages: [
${stageLines}
  ],
};

export const kbMeta: KbMeta = {
  generatedAt: ${j(meta.generatedAt)},
  source: ${j(meta.source)},
  faqCount: ${meta.faqCount},
  sheets: [${meta.sheets.map(j).join(", ")}],
};
`;
}

// ── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log("\n📚  Knowledge-base import\n" + "─".repeat(60));
  if (!fs.existsSync(SOURCE)) {
    console.error(`✗ Source not found: ${SOURCE}`);
    console.error("  Place the workbook at knowledge-base/faq.xlsx and retry.");
    process.exit(1);
  }

  const sheets = parseWorkbook(readZip(fs.readFileSync(SOURCE)));
  console.log(`Workbook: ${path.relative(ROOT, SOURCE)}  (${sheets.length} sheet(s))`);

  // Role detection: name keywords, with a row-count fallback for the FAQ sheet.
  const faqSheet =
    sheets.find((s) => /العملاء|customer|faq/i.test(s.name)) ||
    sheets.slice().sort((a, b) => b.rows.length - a.rows.length)[0];
  const flowSheet = sheets.find((s) => /البوت|bot|flow/i.test(s.name)) || sheets.find((s) => s !== faqSheet);

  const { entries: faq, answerCol, questionCol } = extractFaq(faqSheet, "faq");
  const flow = flowSheet ? extractFlow(flowSheet) : { welcome: "", quickReplies: [], stages: [] };

  // ── Verification logging (requirement: imported Q&A must be verifiable) ──
  console.log(`\nFAQ sheet:  "${faqSheet.name}"  → question col ${questionCol}, answer col ${answerCol}`);
  console.log(`Imported ${faq.length} Q&A pair(s):`);
  faq.forEach((e) => {
    const q = e.question.replace(/\n/g, " ");
    const a = e.answer.replace(/\n/g, " ");
    console.log(`  • [${e.id}] Q: ${q.slice(0, 70)}${q.length > 70 ? "…" : ""}`);
    console.log(`           A: ${a.slice(0, 70)}${a.length > 70 ? "…" : ""}  (${e.answer.length} chars)`);
  });
  if (flowSheet) {
    console.log(`\nFlow sheet: "${flowSheet.name}"`);
    console.log(`  welcome: ${flow.welcome.replace(/\n/g, " ").slice(0, 80)}…`);
    console.log(`  quick replies (${flow.quickReplies.length}): ${flow.quickReplies.join(" | ")}`);
    console.log(`  stages (${flow.stages.length}): ${flow.stages.map((s) => s.label).join("  ›  ")}`);
  }

  // Basic integrity checks.
  const problems = [];
  if (faq.length === 0) problems.push("no FAQ entries were extracted");
  const dupes = faq.filter((e, i) => faq.findIndex((x) => x.question === e.question) !== i);
  if (dupes.length) problems.push(`${dupes.length} duplicate question(s)`);
  if (problems.length) console.warn(`\n⚠  ${problems.join("; ")}`);

  const meta = {
    generatedAt: new Date().toISOString(),
    source: path.relative(ROOT, SOURCE).replace(/\\/g, "/"),
    faqCount: faq.length,
    sheets: sheets.map((s) => s.name),
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, generate(faq, flow, meta), "utf8");

  console.log("\n" + "─".repeat(60));
  console.log(`✓ Wrote ${path.relative(ROOT, OUT).replace(/\\/g, "/")}  (${faq.length} entries, ${flow.stages.length} stages)`);
  console.log("─".repeat(60) + "\n");
}

main();
