import { Link } from "@tanstack/react-router";
import type { Locale } from "@/content/site";
import logo from "@/assets/brand/future-earth-logo.png";
import monogram from "@/assets/brand/future-earth-monogram.png";

/**
 * Official Future Earth Energy Systems logo lockup.
 * `tone="light"` renders a knockout-white variant for dark backgrounds.
 */
export function Brand({
  locale,
  tone = "dark",
  className = "",
  height,
}: {
  locale: Locale;
  tone?: "light" | "dark";
  className?: string;
  height?: number;
}) {
  const to = locale === "ar" ? "/ar" : "/";
  return (
    <Link to={to} aria-label="Future Earth Energy Systems — Home" className={`inline-flex items-center ${className}`}>
      <img
        src={logo}
        alt="Future Earth Energy Systems"
        className={`fe-logo-img ${tone === "light" ? "fe-logo-knockout" : ""}`}
        style={height ? { height } : undefined}
        width={585}
        height={120}
      />
    </Link>
  );
}

/** Compact monogram mark (full-colour), for loaders and tight spaces. */
export function BrandMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src={monogram}
      alt="Future Earth"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, display: "block" }}
    />
  );
}
