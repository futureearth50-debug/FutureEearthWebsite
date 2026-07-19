import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function Reveal({
  children,
  delay = 0,
  y = 30,
  as: Tag = "div",
  className,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  [k: string]: any;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!registered) { gsap.registerPlugin(ScrollTrigger); registered = true; }
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y });
    const tween = gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, delay, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
    return () => { tween.kill(); };
  }, [delay, y]);
  const Comp = Tag as any;
  return <Comp ref={ref} className={className} {...rest}>{children}</Comp>;
}

const hasArabic = (s: string) => /[؀-ۿ]/.test(s);

export function SplitHeadline({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!registered) { gsap.registerPlugin(ScrollTrigger); registered = true; }
    const el = ref.current;
    if (!el) return;
    el.textContent = "";
    const words = text.split(" ");
    // Arabic is cursive — never split into characters (it breaks letter-joining).
    // Split by words instead so each word keeps its ligatures.
    const arabic = hasArabic(text);
    const units: HTMLElement[] = [];
    words.forEach((w, i) => {
      const wSpan = document.createElement("span");
      wSpan.style.display = "inline-block";
      wSpan.style.overflow = "hidden";
      wSpan.style.paddingBottom = "0.12em";
      if (arabic) {
        const inner = document.createElement("span");
        inner.textContent = w;
        inner.style.display = "inline-block";
        inner.style.willChange = "transform,opacity";
        wSpan.appendChild(inner);
        units.push(inner);
      } else {
        for (const ch of Array.from(w)) {
          const c = document.createElement("span");
          c.textContent = ch;
          c.style.display = "inline-block";
          c.style.willChange = "transform,opacity";
          wSpan.appendChild(c);
          units.push(c);
        }
      }
      el.appendChild(wSpan);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
    gsap.set(units, { yPercent: 110, opacity: 0 });
    const tween = gsap.to(units, {
      yPercent: 0, opacity: 1, duration: 1.0, stagger: arabic ? 0.05 : 0.014, ease: "power4.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
    return () => { tween.kill(); };
  }, [text]);
  return <h1 ref={ref} className={className} style={style}>{text}</h1>;
}
