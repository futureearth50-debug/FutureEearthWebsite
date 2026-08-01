// Shared presentational building blocks for every chat surface.
// Purely visual — all state lives in `useLeadChat`. Reused by the floating
// widget and the Contact-page panel so the two never diverge.

import { useRef } from "react";
import { TrendingUp, AlertCircle, RotateCcw, Send } from "lucide-react";
import { leadAssistant, chatWidget, type Locale } from "@/content/site";
import monogram from "@/assets/brand/future-earth-monogram.png";

/** Locale-aware short time label with a "just now" grace window. */
export function formatTime(at: number, locale: Locale): string {
  const diff = Date.now() - at;
  if (diff < 60_000) return chatWidget[locale].justNow;
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(at);
  } catch {
    return "";
  }
}

export function BotAvatar() {
  return (
    <span className="fe-la-mini fe-cw-botavatar">
      <img src={monogram} alt="Future Earth" />
    </span>
  );
}

export function MessageRow({
  role,
  content,
  at,
  locale,
  showTime = true,
}: {
  role: "user" | "assistant";
  content: string;
  at?: number;
  locale: Locale;
  showTime?: boolean;
}) {
  const isUser = role === "user";
  const isRtl = locale === "ar";
  return (
    <div className={`fe-la-row ${isUser ? "user" : ""}`}>
      {!isUser && <BotAvatar />}
      <div className="fe-cw-msg">
        <div className={`fe-la-bubble ${isUser ? "user" : "ai"}`} dir={isRtl ? "rtl" : "ltr"}>
          {content}
        </div>
        {showTime && at != null && (
          <span className="fe-cw-time" aria-hidden="true">
            {formatTime(at, locale)}
          </span>
        )}
      </div>
    </div>
  );
}

/** Animated three-dot "assistant is typing" row. */
export function TypingRow() {
  return (
    <div className="fe-la-row">
      <BotAvatar />
      <div className="fe-la-bubble ai" aria-label="typing">
        <span className="fe-typing">
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  );
}

/** Shown while the lead analysis runs after the conversation completes. */
export function AnalyzingRow({ locale }: { locale: Locale }) {
  const t = leadAssistant[locale];
  return (
    <div className="fe-la-row">
      <span className="fe-la-mini">
        <TrendingUp size={14} />
      </span>
      <div className="fe-la-bubble ai">
        <div className="flex items-center gap-2" style={{ fontWeight: 600, color: "var(--fe-navy)" }}>
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

export function ErrorRow({ locale, onRetry }: { locale: Locale; onRetry: () => void }) {
  const t = leadAssistant[locale];
  return (
    <div className="fe-la-row">
      <span
        className="fe-la-mini"
        style={{ background: "rgba(225,132,26,0.15)", color: "var(--fe-amber-deep)" }}
      >
        <AlertCircle size={14} />
      </span>
      <div className="fe-la-bubble ai" style={{ borderColor: "rgba(225,132,26,0.4)" }}>
        <span>{t.errorMessage}</span>
        <button onClick={onRetry} className="fe-link mt-2" style={{ fontSize: 13 }}>
          <RotateCcw size={14} /> {t.retry}
        </button>
      </div>
    </div>
  );
}

/** Quick-reply chips shown at the start of the conversation. */
export function QuickReplies({
  items,
  onPick,
  disabled,
}: {
  items: string[];
  onPick: (text: string) => void;
  disabled?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <div className="fe-cw-chips" role="group">
      {items.map((q) => (
        <button
          key={q}
          type="button"
          className="fe-cw-chip"
          disabled={disabled}
          onClick={() => onPick(q)}
        >
          {q}
        </button>
      ))}
    </div>
  );
}

/** Auto-growing textarea + send button. Enter sends, Shift+Enter newlines. */
export function Composer({
  locale,
  disabled,
  onSend,
  value,
  onChange,
}: {
  locale: Locale;
  disabled: boolean;
  onSend: () => void;
  value: string;
  onChange: (v: string) => void;
}) {
  const t = leadAssistant[locale];
  const isRtl = locale === "ar";
  const taRef = useRef<HTMLTextAreaElement>(null);

  const grow = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const submit = () => {
    onSend();
    if (taRef.current) taRef.current.style.height = "auto";
  };

  return (
    <div className="fe-la-inputrow">
      <textarea
        ref={taRef}
        className="fe-la-textarea"
        rows={1}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          grow(e.target);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={t.inputPlaceholder}
        disabled={disabled}
        dir={isRtl ? "rtl" : "ltr"}
        aria-label={t.inputPlaceholder}
      />
      <button
        className="fe-la-send"
        onClick={submit}
        disabled={disabled || !value.trim()}
        aria-label={t.send}
        type="button"
      >
        <Send size={17} className="fe-flip-x" />
      </button>
    </div>
  );
}
