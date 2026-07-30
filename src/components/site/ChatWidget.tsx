// ─────────────────────────────────────────────────────────────────────────────
//  Floating AI Chat Widget — mounted on every page (see __root.tsx).
//
//  • Launcher FAB pinned to the bottom corner (side follows text direction).
//  • Glass panel with premium open/close animation.
//  • Proactive welcome teaser after a short delay.
//  • Quick replies, typing indicator, timestamps, smooth auto-scroll.
//  • Keyboard accessible (Esc closes, focus moves to the input on open).
//  • All conversation state comes from `useLeadChat` (persisted across pages).
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquareText, X, ChevronDown, RotateCcw, Sparkles } from "lucide-react";
import { chatWidget, leadAssistant, type Locale } from "@/content/site";
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

const OPEN_KEY = "fe-chat-open";
const SEEN_KEY = "fe-chat-teaser-seen";
const TEASER_DELAY = 6000;

export function ChatWidget({ locale }: { locale: Locale }) {
  const isRtl = locale === "ar";
  const w = chatWidget[locale];
  const t = leadAssistant[locale];
  const chat = useLeadChat(locale);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [input, setInput] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputWrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // ── Mount (client only): restore open state ────────────────────────────────
  useEffect(() => {
    setMounted(true);
    try {
      if (window.sessionStorage.getItem(OPEN_KEY) === "1") setOpen(true);
    } catch {
      /* noop */
    }
  }, []);

  // ── Proactive welcome teaser (once per session, only if never opened) ──────
  useEffect(() => {
    if (!mounted) return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* noop */
    }
    if (seen || open) return;
    const id = window.setTimeout(() => setTeaser(true), TEASER_DELAY);
    return () => window.clearTimeout(id);
  }, [mounted, open]);

  const openPanel = useCallback(() => {
    setOpen(true);
    setTeaser(false);
    try {
      window.sessionStorage.setItem(OPEN_KEY, "1");
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* noop */
    }
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
    try {
      window.sessionStorage.setItem(OPEN_KEY, "0");
    } catch {
      /* noop */
    }
  }, []);

  const dismissTeaser = useCallback(() => {
    setTeaser(false);
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* noop */
    }
  }, []);

  // ── Smooth auto-scroll on new content ──────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (el && open) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chat.messages, chat.streaming, chat.busy, chat.phase, open]);

  // ── Esc to close, focus the input when opening ─────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    const focusId = window.setTimeout(() => {
      inputWrapRef.current?.querySelector("textarea")?.focus();
    }, 340);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusId);
    };
  }, [open, closePanel]);

  const submit = useCallback(() => {
    chat.send(input);
    setInput("");
  }, [chat, input]);

  if (!mounted) return null;

  const showResult = chat.phase === "done" && chat.analysis;
  const composerDisabled = chat.busy || chat.phase !== "chat";

  return (
    <div className={`fe-cw ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"} data-open={open}>
      {/* ── Panel ─────────────────────────────────────────────────────────── */}
      <div
        ref={panelRef}
        className="fe-cw-panel"
        role="dialog"
        aria-label={w.title}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="fe-cw-head">
          <span className="fe-la-avatar">
            <Sparkles size={20} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="fe-cw-head-title">{w.title}</div>
            <div className="fe-cw-head-sub">
              {chat.busy && chat.phase === "chat" ? (
                <span>{t.statusTyping}</span>
              ) : (
                <>
                  <span className="fe-la-dot" />
                  <span>{w.subtitle}</span>
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            className="fe-cw-iconbtn"
            onClick={chat.restart}
            aria-label={t.restart}
            title={t.restart}
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            className="fe-cw-iconbtn"
            onClick={closePanel}
            aria-label={w.minimizeAria}
            title={w.minimizeAria}
          >
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="fe-cw-body" ref={scrollRef} data-lenis-prevent>
          {showResult ? (
            <ResultCard locale={locale} analysis={chat.analysis!} onRestart={chat.restart} />
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Composer */}
        {!showResult && (
          <div className="fe-cw-foot" ref={inputWrapRef}>
            <Composer
              locale={locale}
              disabled={composerDisabled}
              value={input}
              onChange={setInput}
              onSend={submit}
            />
            <div className="fe-cw-disclaimer">
              <Sparkles size={11} style={{ color: "var(--fe-amber-deep)" }} />
              {t.disclaimer}
            </div>
          </div>
        )}
      </div>

      {/* ── Proactive teaser bubble ──────────────────────────────────────────── */}
      {teaser && !open && (
        <button type="button" className="fe-cw-teaser" onClick={openPanel}>
          <span
            className="fe-cw-teaser-close"
            role="button"
            aria-label={w.closeAria}
            onClick={(e) => {
              e.stopPropagation();
              dismissTeaser();
            }}
          >
            <X size={12} />
          </span>
          <span className="fe-cw-teaser-text">{w.welcome.split("\n")[0]}</span>
        </button>
      )}

      {/* ── Launcher FAB ─────────────────────────────────────────────────────── */}
      <button
        type="button"
        className="fe-cw-fab"
        onClick={() => (open ? closePanel() : openPanel())}
        aria-label={open ? w.closeAria : w.openAria}
        aria-expanded={open}
      >
        <span className="fe-cw-fab-icon">
          {open ? <ChevronDown size={24} /> : <MessageSquareText size={23} />}
        </span>
        {!open && !chat.hasEngaged && <span className="fe-cw-fab-pulse" aria-hidden="true" />}
      </button>
    </div>
  );
}

export default ChatWidget;
