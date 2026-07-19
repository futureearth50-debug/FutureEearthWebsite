import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--fe-navy)", color: "white" }}>
      <div className="max-w-md text-center">
        <h1 className="fe-display" style={{ fontSize: 96, fontWeight: 600, color: "var(--fe-amber)" }}>404</h1>
        <h2 className="mt-2 fe-display" style={{ fontSize: 22, fontWeight: 600 }}>Page not found</h2>
        <p className="mt-3" style={{ color: "rgba(255,255,255,0.6)" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="fe-btn fe-btn-primary mt-8">Go home</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--fe-navy)", color: "white" }}>
      <div className="max-w-md text-center">
        <h1 className="fe-display" style={{ fontSize: 22, fontWeight: 600 }}>This page didn't load</h1>
        <p className="mt-3" style={{ color: "rgba(255,255,255,0.6)" }}>Something went wrong. Try again or head home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="fe-btn fe-btn-primary">Try again</button>
          <a href="/" className="fe-btn fe-btn-ghost">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Future Earth Energy Systems — Solar & Storage at Scale in Saudi Arabia" },
      { name: "description", content: "Future Earth engineers utility-scale solar, rooftop, hybrid microgrid and lithium battery storage systems across Saudi Arabia. 100+ MW installed, 15+ years experience." },
      { name: "author", content: "Future Earth Energy Systems" },
      { property: "og:title", content: "Future Earth Energy Systems — Solar & Storage at Scale" },
      { property: "og:description", content: "Solar energy and lithium battery storage engineered for Saudi Arabia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-512.png", type: "image/png", sizes: "512x512" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
