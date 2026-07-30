// Contact-page chat panel. Same engine as the floating widget (`useLeadChat` +
// shared chat parts) rendered as a large in-page panel instead of a launcher.
// This is the unified "one engine, both surfaces" implementation.

import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { leadAssistant, type Locale } from "@/content/site";
import { useLeadChat } from "@/features/lead/useLeadChat";
import {
  MessageRow,
  TypingRow,
  AnalyzingRow,
  ErrorRow,
  QuickReplies,
  Composer,
} from "./chat/parts";
import { ResultCard } from "./chat/ResultCard";

export function LeadAssistant({ locale }: { locale: Locale }) {
  const t = leadAssistant[locale];
  const chat = useLeadChat(locale);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chat.messages, chat.streaming, chat.busy, chat.phase]);

  const submit = useCallback(() => {
    chat.send(input);
    setInput("");
  }, [chat, input]);

  // ── Result view ────────────────────────────────────────────────────────────
  if (chat.phase === "done" && chat.analysis) {
    return (
      <div className="fe-chat">
        <ResultCard locale={locale} analysis={chat.analysis} onRestart={chat.restart} />
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
              {chat.busy && chat.phase === "chat" ? (
                <span>{t.statusTyping}</span>
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
          {chat.messages.map((m, i) => (
            <MessageRow key={i} role={m.role} content={m.content} at={m.at} locale={locale} />
          ))}

          {chat.busy && chat.streaming && (
            <MessageRow role="assistant" content={chat.streaming} locale={locale} showTime={false} />
          )}
          {chat.busy && !chat.streaming && <TypingRow />}
          {chat.phase === "analyzing" && <AnalyzingRow locale={locale} />}
          {chat.phase === "error" && <ErrorRow locale={locale} onRetry={chat.retry} />}

          <QuickReplies items={chat.quickReplies} onPick={chat.send} disabled={chat.busy} />
        </div>

        {/* Composer */}
        <div className="fe-la-foot">
          <Composer
            locale={locale}
            disabled={chat.busy || chat.phase !== "chat"}
            value={input}
            onChange={setInput}
            onSend={submit}
          />
          <div
            className="flex items-center justify-between mt-2.5 gap-3"
            style={{ fontSize: 11.5, color: "var(--fe-slate-2)" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={12} style={{ color: "var(--fe-amber-deep)" }} />
              {t.disclaimer}
            </span>
            {chat.hasEngaged && (
              <button
                onClick={chat.restart}
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
