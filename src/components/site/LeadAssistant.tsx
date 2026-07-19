import { useCallback, useEffect, useRef, useState } from "react";
import {
  Send,
  Sparkles,
  RotateCcw,
  MessageCircle,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { contactInfo, leadAssistant, type Locale } from "@/content/site";
import {
  LEAD_COMPLETE_MARKER,
  type ChatMessage,
  type LeadAnalysis,
  type Qualification,
} from "@/features/lead/types";
import { chatStreamFn, analyzeLeadFn } from "@/features/lead/serverFns";

type Phase = "chat" | "analyzing" | "done" | "error";

const TIER_COLOR: Record<Qualification, string> = {
  Hot: "#E1841A",
  Warm: "#F5A623",
  Cold: "#3E6690",
};

/** Remove the completion marker (and any trailing partial of it) for display. */
function stripMarker(text: string): string {
  const idx = text.indexOf(LEAD_COMPLETE_MARKER);
  if (idx !== -1) return text.slice(0, idx).trimEnd();
  // Hide a partially-streamed marker tail like "[[LEAD_QUAL".
  return text.replace(/\s*\[\[?[A-Z_]*$/, "");
}

async function readTextStream(res: Response, onDelta: (full: string) => void): Promise<string> {
  if (!res.body) {
    const text = await res.text();
    onDelta(text);
    return text;
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    full += decoder.decode(value, { stream: true });
    onDelta(full);
  }
  full += decoder.decode();
  onDelta(full);
  return full;
}

export function LeadAssistant({ locale }: { locale: Locale }) {
  const t = leadAssistant[locale];
  const isRtl = locale === "ar";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(""); // live assistant text being typed
  const [busy, setBusy] = useState(false); // awaiting/streaming a reply
  const [phase, setPhase] = useState<Phase>("chat");
  const [analysis, setAnalysis] = useState<LeadAnalysis | null>(null);
  const [input, setInput] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const startedRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streaming, busy, scrollToBottom]);

  /** Run one assistant turn over the given history, streaming its reply in. */
  const runAssistantTurn = useCallback(
    async (history: ChatMessage[]) => {
      setBusy(true);
      setStreaming("");
      try {
        const res = (await chatStreamFn({
          data: { locale, messages: history },
        })) as unknown as Response;

        if (!res.ok) throw new Error(`Chat stream failed: ${res.status}`);

        const full = await readTextStream(res, (partial) => {
          setStreaming(stripMarker(partial));
        });

        const visible = stripMarker(full);
        const complete = full.includes(LEAD_COMPLETE_MARKER);
        const nextHistory: ChatMessage[] = [...history, { role: "assistant", content: visible }];
        setMessages(nextHistory);
        setStreaming("");
        setBusy(false);

        if (complete) {
          await finalize(nextHistory);
        }
      } catch (err) {
        console.error(err);
        setStreaming("");
        setBusy(false);
        setPhase("error");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  const finalize = useCallback(
    async (history: ChatMessage[]) => {
      setPhase("analyzing");
      try {
        const result = await analyzeLeadFn({ data: { locale, messages: history } });
        setAnalysis(result.analysis);
        setPhase("done");
      } catch (err) {
        console.error(err);
        setPhase("error");
      }
    },
    [locale],
  );

  // Kick off the conversation once on mount.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void runAssistantTurn([]);
  }, [runAssistantTurn]);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text || busy || phase !== "chat") return;
    const history: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
    void runAssistantTurn(history);
  }, [input, busy, phase, messages, runAssistantTurn]);

  const restart = useCallback(() => {
    setMessages([]);
    setStreaming("");
    setAnalysis(null);
    setBusy(false);
    setPhase("chat");
    startedRef.current = true;
    void runAssistantTurn([]);
  }, [runAssistantTurn]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const onInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  // ── Result view ────────────────────────────────────────────────────────────
  if (phase === "done" && analysis) {
    return (
      <div className="fe-chat">
        <ResultCard locale={locale} analysis={analysis} onRestart={restart} />
      </div>
    );
  }

  return (
    <div className="fe-chat">
      <div className="fe-la">
        {/* Header */}
        <div className="fe-la-head">
          <span className="fe-la-avatar">
            <Sparkles size={20} />
          </span>
          <div className="flex-1 min-w-0">
            <div style={{ fontWeight: 600, fontSize: "0.98rem" }}>{t.assistantName}</div>
            <div
              className="flex items-center gap-1.5 mt-0.5"
              style={{ fontSize: 12, color: "rgba(255,255,255,0.62)" }}
            >
              {phase === "analyzing" || busy ? (
                <span>{busy && phase === "chat" ? t.statusTyping : t.statusOnline}</span>
              ) : (
                <>
                  <span className="fe-la-dot" />
                  <span>{t.statusOnline}</span>
                </>
              )}
            </div>
          </div>
          <span
            className="fe-eyebrow no-tick"
            style={{ color: "var(--fe-amber)", fontSize: "0.62rem" }}
          >
            {t.panelEyebrow}
          </span>
        </div>

        {/* Messages */}
        <div className="fe-la-scroll" ref={scrollRef} data-lenis-prevent>
          {messages.map((m, i) => (
            <MessageRow key={i} role={m.role} text={m.content} isRtl={isRtl} />
          ))}

          {busy && streaming && <MessageRow role="assistant" text={streaming} isRtl={isRtl} />}

          {busy && !streaming && (
            <div className="fe-la-row">
              <span className="fe-la-mini">
                <Sparkles size={14} />
              </span>
              <div className="fe-la-bubble ai" aria-label="typing">
                <span className="fe-typing">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            </div>
          )}

          {phase === "analyzing" && <AnalyzingRow t={t} />}

          {phase === "error" && (
            <div className="fe-la-row">
              <span
                className="fe-la-mini"
                style={{ background: "rgba(225,132,26,0.15)", color: "var(--fe-amber-deep)" }}
              >
                <AlertCircle size={14} />
              </span>
              <div className="fe-la-bubble ai" style={{ borderColor: "rgba(225,132,26,0.4)" }}>
                <span>{t.errorMessage}</span>
                <button onClick={restart} className="fe-link mt-2" style={{ fontSize: 13 }}>
                  <RotateCcw size={14} /> {t.retry}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="fe-la-foot">
          <div className="fe-la-inputrow">
            <textarea
              ref={taRef}
              className="fe-la-textarea"
              rows={1}
              value={input}
              onChange={onInput}
              onKeyDown={onKeyDown}
              placeholder={t.inputPlaceholder}
              disabled={busy || phase !== "chat"}
              dir={isRtl ? "rtl" : "ltr"}
            />
            <button
              className="fe-la-send"
              onClick={send}
              disabled={!input.trim() || busy || phase !== "chat"}
              aria-label={t.send}
            >
              <Send size={17} className="fe-flip-x" />
            </button>
          </div>
          <div
            className="flex items-center justify-between mt-2.5 gap-3"
            style={{ fontSize: 11.5, color: "var(--fe-slate-2)" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={12} style={{ color: "var(--fe-amber-deep)" }} />
              {t.disclaimer}
            </span>
            {messages.length > 1 && (
              <button
                onClick={restart}
                className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
                style={{ whiteSpace: "nowrap" }}
              >
                <RotateCcw size={12} /> {t.restart}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageRow({
  role,
  text,
  isRtl,
}: {
  role: "user" | "assistant";
  text: string;
  isRtl: boolean;
}) {
  const isUser = role === "user";
  return (
    <div className={`fe-la-row ${isUser ? "user" : ""}`}>
      {!isUser && (
        <span className="fe-la-mini">
          <Sparkles size={14} />
        </span>
      )}
      <div className={`fe-la-bubble ${isUser ? "user" : "ai"}`} dir={isRtl ? "rtl" : "ltr"}>
        {text}
      </div>
    </div>
  );
}

function AnalyzingRow({ t }: { t: typeof leadAssistant.en }) {
  return (
    <div className="fe-la-row">
      <span className="fe-la-mini">
        <TrendingUp size={14} />
      </span>
      <div className="fe-la-bubble ai">
        <div
          className="flex items-center gap-2"
          style={{ fontWeight: 600, color: "var(--fe-navy)" }}
        >
          <span className="fe-typing">
            <span />
            <span />
            <span />
          </span>
          {t.analyzingTitle}
        </div>
        <div className="mt-1.5" style={{ fontSize: "0.88rem", color: "var(--fe-slate)" }}>
          {t.analyzingSub}
        </div>
      </div>
    </div>
  );
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 58;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(100, score)) / 100);
  return (
    <div className="fe-la-ring">
      <svg width="132" height="132" viewBox="0 0 132 132">
        <circle cx="66" cy="66" r={r} fill="none" stroke="var(--fe-line)" strokeWidth="10" />
        <circle
          cx="66"
          cy="66"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.1s var(--fe-ease)" }}
        />
      </svg>
      <div className="fe-la-ring-num">
        <div
          className="fe-display"
          style={{ fontSize: "2rem", fontWeight: 600, color: "var(--fe-navy)", lineHeight: 1 }}
        >
          {score}
        </div>
        <div className="fe-mono" style={{ fontSize: 10, color: "var(--fe-slate-2)", marginTop: 2 }}>
          / 100
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  locale,
  analysis,
  onRestart,
}: {
  locale: Locale;
  analysis: LeadAnalysis;
  onRestart: () => void;
}) {
  const t = leadAssistant[locale];
  const tierColor = TIER_COLOR[analysis.qualification];

  return (
    <div className="fe-la-result">
      <div className="flex items-center gap-2 fe-eyebrow" style={{ color: "var(--fe-green)" }}>
        <CheckCircle2 size={16} /> {t.doneEyebrow}
      </div>
      <h3
        className="fe-display mt-3"
        style={{ fontSize: "1.55rem", fontWeight: 600, color: "var(--fe-navy)", lineHeight: 1.15 }}
      >
        {t.doneTitle}
      </h3>
      <p
        className="mt-2.5"
        style={{ color: "var(--fe-slate)", fontSize: "0.95rem", lineHeight: 1.6 }}
      >
        {t.doneSub}
      </p>

      {/* Score + tier */}
      <div
        className="flex flex-wrap items-center gap-6 mt-7 pt-7"
        style={{ borderTop: "1px solid var(--fe-line)" }}
      >
        <ScoreRing score={analysis.score} color={tierColor} />
        <div className="flex-1 min-w-[180px] space-y-3">
          <div>
            <div
              className="fe-mono"
              style={{
                fontSize: 10.5,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--fe-slate-2)",
              }}
            >
              {t.scoreLabel}
            </div>
            <span className={`fe-la-tier ${analysis.qualification} mt-2`}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: tierColor }} />
              {t.tiers[analysis.qualification]}
            </span>
          </div>
          {(analysis.contact.name || analysis.contact.company) && (
            <div style={{ fontSize: "0.92rem", color: "var(--fe-navy)" }}>
              {analysis.contact.name && (
                <div style={{ fontWeight: 600 }}>{analysis.contact.name}</div>
              )}
              {analysis.contact.company && (
                <div style={{ color: "var(--fe-slate)" }}>{analysis.contact.company}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-7">
        <div
          className="fe-mono"
          style={{
            fontSize: 10.5,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--fe-steel-2)",
          }}
        >
          {t.summaryLabel}
        </div>
        <p
          className="mt-2"
          style={{ color: "var(--fe-slate)", fontSize: "0.95rem", lineHeight: 1.65 }}
        >
          {analysis.summary}
        </p>
      </div>

      {/* Insights */}
      {analysis.insights.length > 0 && (
        <div className="mt-6">
          <div
            className="fe-mono"
            style={{
              fontSize: 10.5,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--fe-steel-2)",
            }}
          >
            {t.insightsLabel}
          </div>
          <div className="mt-2">
            {analysis.insights.map((ins, i) => (
              <div key={i} className="fe-la-insight">
                <span style={{ color: "var(--fe-amber-deep)", marginTop: 2 }}>
                  <Sparkles size={14} />
                </span>
                <span>{ins}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next step */}
      {analysis.recommendedAction && (
        <div
          className="mt-6 rounded-2xl p-4"
          style={{ background: "var(--fe-paper)", border: "1px solid var(--fe-line)" }}
        >
          <div
            className="fe-mono"
            style={{
              fontSize: 10.5,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--fe-steel-2)",
            }}
          >
            {t.nextLabel}
          </div>
          <p
            className="mt-1.5"
            style={{ color: "var(--fe-navy)", fontSize: "0.92rem", lineHeight: 1.55 }}
          >
            {analysis.recommendedAction}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-7 flex flex-wrap gap-2.5">
        <a
          href={`https://wa.me/${contactInfo.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fe-btn fe-btn-green"
          style={{ padding: "0.85rem 1.4rem", fontSize: 14 }}
        >
          <MessageCircle size={16} /> {t.talkNow}
        </a>
        <button
          onClick={onRestart}
          className="fe-btn fe-btn-outline"
          style={{ padding: "0.85rem 1.4rem", fontSize: 14 }}
        >
          <RotateCcw size={15} /> {t.newChat}
        </button>
      </div>

      <div
        className="mt-5 inline-flex items-center gap-2"
        style={{ fontSize: 12.5, color: "var(--fe-green)" }}
      >
        <CheckCircle2 size={14} /> {t.notifiedNote}
      </div>
    </div>
  );
}
