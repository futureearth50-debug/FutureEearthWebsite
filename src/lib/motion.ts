import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenisInstance: Lenis | null = null;
let registered = false;

export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisInstance = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      ScrollTrigger.update();
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}

export function getLenis() {
  return lenisInstance;
}

export function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".fe-reveal"));
    if (!items.length) return;
    const st = ScrollTrigger.batch(items, {
      start: "top 88%",
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
        });
      },
      once: true,
    });
    gsap.set(items, { opacity: 0, y: 28 });
    return () => {
      st.forEach((t) => t.kill());
    };
  }, []);
  return ref;
}

/** Split text into words+chars for reveal animation (simple, no external plugin) */
export function splitText(el: HTMLElement) {
  const text = el.textContent || "";
  el.textContent = "";
  const words = text.split(/(\s+)/);
  const spans: HTMLElement[] = [];
  words.forEach((w) => {
    if (/^\s+$/.test(w)) {
      el.appendChild(document.createTextNode(w));
      return;
    }
    const word = document.createElement("span");
    word.className = "fe-word";
    for (const ch of Array.from(w)) {
      const c = document.createElement("span");
      c.className = "fe-char";
      c.style.display = "inline-block";
      c.style.willChange = "transform,opacity";
      c.textContent = ch;
      word.appendChild(c);
      spans.push(c);
    }
    el.appendChild(word);
  });
  return spans;
}

export function useSplitReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }
    const el = ref.current;
    if (!el) return;
    const chars = splitText(el);
    gsap.set(chars, { yPercent: 110, opacity: 0 });
    const tween = gsap.to(chars, {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.018,
      ease: "power4.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
    return () => {
      tween.kill();
    };
  }, []);
  return ref;
}
