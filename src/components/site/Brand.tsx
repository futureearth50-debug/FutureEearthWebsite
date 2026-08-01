import { Link } from "@tanstack/react-router";
import type { Locale } from "@/content/site";
import logo from "@/assets/brand/future-earth-logo.png";
import logoLight from "@/assets/brand/future-earth-logo-light.png";
import monogram from "@/assets/brand/future-earth-monogram.png";

/**
 * Official Future Earth Energy Systems logo lockup.
 * `tone="light"` uses the supplied light artwork for dark backgrounds — it keeps
 * the monogram's tonal depth, which a flat white knockout filter destroyed.
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
  const to = locale === "ar" ? "/ar" : "/en";
  return (
    <Link to={to} aria-label="Future Earth Energy Systems — Home" className={`inline-flex items-center ${className}`}>
      <img
        src={tone === "light" ? logoLight : logo}
        alt="Future Earth Energy Systems"
        className="fe-logo-img"
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
