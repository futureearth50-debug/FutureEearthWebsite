import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { gsap } from "gsap";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Preloader } from "./Preloader";
import { useSmoothScroll } from "@/lib/motion";
import type { Locale } from "@/content/site";

export function SiteLayout({ locale, children }: { locale: Locale; children: ReactNode }) {
  useSmoothScroll();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Set html dir
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    html.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
    html.setAttribute("lang", locale === "ar" ? "ar" : "en");
  }, [locale]);

  // Route change wipe
  useEffect(() => {
    const wipe = document.querySelector<HTMLElement>(".fe-wipe");
    if (!wipe) return;
    gsap.fromTo(wipe,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.5, ease: "expo.inOut", onComplete: () => {
        gsap.to(wipe, { yPercent: -100, duration: 0.6, delay: 0.05, ease: "expo.inOut", onComplete: () => {
          gsap.set(wipe, { yPercent: 100 });
        }});
      }});
    window.scrollTo(0, 0);
  }, [pathname]);

  // Custom cursor
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;
    const cursor = document.createElement("div");
    cursor.className = "fe-cursor";
    document.body.appendChild(cursor);
    const move = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.3, ease: "power2.out" });
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, .fe-card, .fe-chip, input, textarea")) cursor.classList.add("is-hover");
      else cursor.classList.remove("is-hover");
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cursor.remove();
    };
  }, []);

  return (
    <>
      <Preloader />
      <div className="fe-wipe" />
      <Header locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
    </>
  );
}
