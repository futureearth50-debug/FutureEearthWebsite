import { useEffect, useState } from "react";
import { gsap } from "gsap";
import logo from "@/assets/brand/future-earth-logo-light.png";

export function Preloader() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete: () => setGone(true) });
    tl.fromTo(".fe-pre-logo", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "power4.out" })
      .fromTo(".fe-pre-bar-fill", { scaleX: 0 }, { scaleX: 1, duration: 0.95, ease: "power2.inOut", transformOrigin: "left center" }, "-=0.5")
      .to(".fe-pre-logo", { y: -18, opacity: 0, duration: 0.5, ease: "power3.in", delay: 0.15 })
      .to(".fe-pre-panel", { yPercent: -100, duration: 1.0, ease: "expo.inOut" }, "-=0.25");
  }, []);

  if (gone) return null;
  return (
    <div className="fe-preloader">
      <div className="fe-pre-panel absolute inset-0 fe-blueprint-dark" style={{ background: "var(--fe-grad-dark)" }} />
      <div className="relative z-10 flex flex-col items-center gap-6">
        <img src={logo} alt="Future Earth Energy Systems" className="fe-pre-logo" style={{ height: 46, width: "auto" }} />
        <div style={{ width: 180, height: 2, background: "rgba(255,255,255,0.12)", borderRadius: 999, overflow: "hidden" }}>
          <div className="fe-pre-bar-fill" style={{ height: "100%", width: "100%", background: "var(--fe-grad-sun)" }} />
        </div>
      </div>
    </div>
  );
}
