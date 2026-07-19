import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

const sizes = {
  sm: "clamp(1.8rem,3vw,2.4rem)",
  md: "clamp(2.1rem,3.6vw,2.9rem)",
  lg: "clamp(2.4rem,4.6vw,4rem)",
} as const;

export function StatCounter({
  value,
  suffix = "",
  unit = "",
  label,
  duration = 2.0,
  tone = "dark",
  size = "lg",
  bare = false,
}: {
  value: number;
  suffix?: string;
  unit?: string;
  label: string;
  duration?: number;
  tone?: "dark" | "light";
  size?: keyof typeof sizes;
  bare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!registered) { gsap.registerPlugin(ScrollTrigger); registered = true; }
    const el = ref.current;
    if (!el) return;
    const state = { n: 0 };
    const tween = gsap.to(state, {
      n: value,
      duration,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onUpdate: () => setDisplay(Math.floor(state.n).toLocaleString()),
      onComplete: () => setDisplay(value.toLocaleString()),
    });
    return () => { tween.kill(); };
  }, [value, duration]);

  if (bare) {
    return <span ref={ref as React.RefObject<HTMLSpanElement>}>{display}{suffix}</span>;
  }

  const numberColor = tone === "light" ? "#fff" : "var(--fe-navy)";
  const labelColor = tone === "light" ? "rgba(255,255,255,0.62)" : "var(--fe-slate)";

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <div className="fe-display flex items-baseline gap-1" style={{ fontSize: sizes[size], fontWeight: 600, letterSpacing: "-0.03em", color: numberColor }}>
        <span>{display}</span>
        <span style={{ color: "var(--fe-amber)" }}>{suffix}</span>
        {unit && <span className="fe-mono" style={{ fontSize: "0.4em", color: tone === "light" ? "var(--fe-steel)" : "var(--fe-slate)", marginInlineStart: "0.4em", fontWeight: 500 }}>{unit}</span>}
      </div>
      {label && <div style={{ fontSize: "0.88rem", color: labelColor, fontWeight: 500, lineHeight: 1.35 }}>{label}</div>}
    </div>
  );
}
