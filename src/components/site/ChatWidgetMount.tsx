// Global mount point for the floating chat widget.
//
// • Lazy-loaded: the widget bundle is fetched only in the browser, after
//   hydration, so it never blocks first paint or SSR.
// • Locale is derived from the route (paths under /ar are Arabic).

import { lazy, Suspense, useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import type { Locale } from "@/content/site";

const ChatWidget = lazy(() => import("./ChatWidget"));

export function ChatWidgetMount() {
  const [ready, setReady] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Defer to the client only — no SSR render, no hydration cost on first paint.
  useEffect(() => setReady(true), []);
  if (!ready) return null;

  // The Contact page has a dedicated full panel (same engine) — don't also show
  // the launcher there. And never on the internal analytics dashboard.
  const path = pathname.replace(/\/+$/, "");
  if (path === "/contact" || path === "/ar/contact" || path === "/analytics") return null;

  const locale: Locale = pathname === "/ar" || pathname.startsWith("/ar/") ? "ar" : "en";

  return (
    <Suspense fallback={null}>
      <ChatWidget locale={locale} />
    </Suspense>
  );
}
