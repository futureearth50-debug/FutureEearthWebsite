// ─────────────────────────────────────────────────────────────────────────────
//  useLeadChat — the one chat engine behind BOTH surfaces
//  (the global floating widget and the Contact-page panel).
//
//  Responsibilities:
//   • Seeds the authored welcome message + quick replies (instant, no API call).
//   • Streams assistant turns via the server functions, grounded on the Excel KB.
//   • Detects the completion marker → runs lead analysis (score + notify).
//   • Persists the conversation in sessionStorage so it survives navigation
//     ("remembers state while browsing") and restores on mount.
//   • Tracks per-message timestamps and conversation provenance (start page,
//     referrer) for later analytics, and guards against duplicate sends.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/content/site";
import { chatWidget } from "@/content/site";
import { chatStreamFn, analyzeLeadFn } from "./serverFns";
import { readTextStream, stripMarker } from "./stream";
import { LEAD_COMPLETE_MARKER, type ChatMessage, type ChatRole, type LeadAnalysis } from "./types";
import { recordEvent, newConversationId } from "@/features/analytics/client";

export type ChatPhase = "chat" | "analyzing" | "done" | "error";

/** A message as rendered in the UI — server only ever sees `{ role, content }`. */
export interface UiMessage {
  role: ChatRole;
  content: string;
  /** epoch ms when the message was added (for timestamps). */
  at: number;
}

interface PersistedState {
  v: 1;
  locale: Locale;
  messages: UiMessage[];
  phase: ChatPhase;
  analysis: LeadAnalysis | null;
  conversationId: string | null;
  startedAt: number | null;
  pageStarted: string | null;
  referrer: string | null;
}

const STORAGE_KEY = "fe-chat-v1";
const now = () => Date.now();
const toServer = (m: UiMessage): ChatMessage => ({ role: m.role, content: m.content });

function loadPersisted(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedState;
    if (data?.v !== 1 || !Array.isArray(data.messages)) return null;
    return data;
  } catch {
    return null;
  }
}

export interface UseLeadChat {
  messages: UiMessage[];
  streaming: string;
  busy: boolean;
  phase: ChatPhase;
  analysis: LeadAnalysis | null;
  /** Quick-reply chips — only present at the very start of the conversation. */
  quickReplies: string[];
  /** True once the visitor has sent at least one message. */
  hasEngaged: boolean;
  send: (text: string) => void;
  restart: () => void;
  retry: () => void;
}

export function useLeadChat(locale: Locale): UseLeadChat {
  const welcome = chatWidget[locale].welcome;

  const [messages, setMessages] = useState<UiMessage[]>([
    { role: "assistant", content: welcome, at: now() },
  ]);
  const [streaming, setStreaming] = useState("");
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<ChatPhase>("chat");
  const [analysis, setAnalysis] = useState<LeadAnalysis | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Conversation provenance (analytics attribution + sales notification).
  const meta = useRef<{
    conversationId: string | null;
    startedAt: number | null;
    pageStarted: string | null;
    referrer: string | null;
  }>({
    conversationId: null,
    startedAt: null,
    pageStarted: null,
    referrer: null,
  });
  // Guards against a double-submit sending the same message twice.
  const inFlight = useRef(false);

  // ── Restore persisted conversation on mount (client only) ──────────────────
  useEffect(() => {
    const saved = loadPersisted();
    if (saved && saved.messages.length > 0) {
      setMessages(saved.messages);
      setPhase(saved.phase === "analyzing" ? "chat" : saved.phase); // never resume mid-analysis
      setAnalysis(saved.analysis);
      meta.current = {
        conversationId: saved.conversationId ?? null,
        startedAt: saved.startedAt,
        pageStarted: saved.pageStarted,
        referrer: saved.referrer,
      };
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Persist on change (after hydration, so we don't clobber saved state) ───
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    const state: PersistedState = {
      v: 1,
      locale,
      messages,
      phase,
      analysis,
      conversationId: meta.current.conversationId,
      startedAt: meta.current.startedAt,
      pageStarted: meta.current.pageStarted,
      referrer: meta.current.referrer,
    };
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full / unavailable — non-fatal */
    }
  }, [messages, phase, analysis, hydrated, locale]);

  const finalize = useCallback(
    async (history: UiMessage[]) => {
      setPhase("analyzing");
      try {
        const result = await analyzeLeadFn({
          data: {
            locale,
            messages: history.map(toServer),
            meta: {
              page: meta.current.pageStarted ?? undefined,
              referrer: meta.current.referrer ?? undefined,
              userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
              conversationId: meta.current.conversationId ?? undefined,
              startedAt: meta.current.startedAt ?? undefined,
            },
          },
        });
        // A rate-limited (429) or malformed response deserializes without an
        // `analysis` — treat that as an error rather than a blank "done" view.
        if (!result?.analysis) throw new Error("Analysis unavailable");
        setAnalysis(result.analysis);
        setPhase("done");
      } catch (err) {
        console.error("[chat] analysis failed:", err);
        setPhase("error");
      }
    },
    [locale],
  );

  const runAssistantTurn = useCallback(
    async (history: UiMessage[]) => {
      setBusy(true);
      setStreaming("");
      try {
        const res = (await chatStreamFn({
          data: { locale, messages: history.map(toServer) },
        })) as unknown as Response;

        if (!res.ok) {
          const errText = await res.text().catch(() => `HTTP ${res.status}`);
          throw new Error(`Chat stream failed: ${errText}`);
        }

        const full = await readTextStream(res, (partial) => setStreaming(stripMarker(partial)));
        const visible = stripMarker(full);
        const complete = full.includes(LEAD_COMPLETE_MARKER);

        const next: UiMessage[] = [...history, { role: "assistant", content: visible, at: now() }];
        setMessages(next);
        setStreaming("");
        setBusy(false);
        if (complete) await finalize(next);
      } catch (err) {
        console.error("[chat] turn failed:", err);
        setStreaming("");
        setBusy(false);
        setPhase("error");
      } finally {
        inFlight.current = false;
      }
    },
    [locale, finalize],
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || busy || inFlight.current || phase !== "chat") return;
      // Duplicate guard: ignore an identical consecutive user message.
      const last = messages[messages.length - 1];
      if (last?.role === "user" && last.content === text) return;

      inFlight.current = true;

      // First message: establish provenance + analytics "started".
      if (meta.current.startedAt == null) {
        const conversationId = newConversationId();
        meta.current = {
          conversationId,
          startedAt: now(),
          pageStarted: typeof window !== "undefined" ? window.location.pathname : null,
          referrer: typeof document !== "undefined" ? document.referrer || null : null,
        };
        recordEvent({
          type: "started",
          conversationId,
          locale,
          page: meta.current.pageStarted ?? undefined,
          referrer: meta.current.referrer ?? undefined,
        });
      }

      // Record the visitor's question (turn = count of their messages so far).
      const turn = messages.filter((m) => m.role === "user").length + 1;
      if (meta.current.conversationId) {
        recordEvent({ type: "question", conversationId: meta.current.conversationId, turn, text });
      }

      const history: UiMessage[] = [...messages, { role: "user", content: text, at: now() }];
      setMessages(history);
      void runAssistantTurn(history);
    },
    [busy, phase, messages, runAssistantTurn, locale],
  );

  const restart = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        /* noop */
      }
    }
    meta.current = { conversationId: null, startedAt: null, pageStarted: null, referrer: null };
    inFlight.current = false;
    setMessages([{ role: "assistant", content: welcome, at: now() }]);
    setStreaming("");
    setAnalysis(null);
    setBusy(false);
    setPhase("chat");
  }, [welcome]);

  const retry = useCallback(() => {
    if (phase !== "error") return;
    setPhase("chat");
    // On failure we never appended an assistant turn, so `messages` still ends at
    // the visitor's last message — re-run the turn over the current history.
    inFlight.current = true;
    void runAssistantTurn(messages);
  }, [phase, messages, runAssistantTurn]);

  // Quick replies show only before the visitor has engaged (welcome-only state).
  const hasEngaged = messages.some((m) => m.role === "user");
  const quickReplies = !hasEngaged && phase === "chat" && !busy ? chatWidget[locale].quickReplies : [];

  return { messages, streaming, busy, phase, analysis, quickReplies, hasEngaged, send, restart, retry };
}
