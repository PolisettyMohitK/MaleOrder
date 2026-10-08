import Link from "next/link";
import { store } from "@/data/store.config";

interface LogoProps {
  /** "ink" for light backgrounds, "silver" for the dark footer. */
  tone?: "ink" | "silver";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const scale = {
  sm: { mark: "text-[15px]", sub: "text-[0.4375rem] tracking-[0.42em]", gap: "mt-[5px]" },
  md: { mark: "text-[19px]", sub: "text-[0.5rem] tracking-[0.44em]", gap: "mt-[6px]" },
  lg: { mark: "text-[30px]", sub: "text-[0.5625rem] tracking-[0.46em]", gap: "mt-2" },
} as const;

/**
 * The store mark. A serif wordmark with the neighbourhood set beneath it in
 * letter-spaced caps, split by a silver hairline. Both words come from
 * store.config.ts, so renaming the shop is a one-file change.
 *
 * `tone="silver"` fills the wordmark with a metallic gradient for use on the
 * dark footer and intro.
 */
export function Logo({ tone = "ink", size = "md", className = "" }: LogoProps) {
  const s = scale[size];
  const light = tone === "silver";

  return (
    <Link
      href="/"
      className={`group inline-flex flex-col items-center leading-none ${className}`}
    >
      <span
        className={`font-display ${s.mark} tracking-[0.02em] ${
          light ? "type-silver-dark" : "text-ink"
        }`}
      >
        {store.name}
      </span>
      <span className={`silver-rule w-full ${s.gap} mb-[5px] opacity-70`} />
      <span className={`label ${s.sub} ${light ? "text-silver-200" : "text-muted"}`}>
        {store.area}
      </span>
    </Link>
  );
}