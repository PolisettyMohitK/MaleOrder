"use client";

import { motion } from "motion/react";
import { REG, SUB, THE, WORD } from "./logo-paths";

/**
 * The Male Order Erise logo, traced from the original artwork, so every
 * letter is the real shape: the script "The", MALE ORDER, ERISE and the ®.
 * Coordinates are in a 512 x 512 space where the badge's disc fills the box.
 *
 * `circle` gives the full badge: ink on a white disc, as in the original.
 * With `animate`, the logo draws itself: the rim goes round, then each
 * letter's outline is drawn and filled in, one after another.
 */
interface LogoMarkProps {
  /** Ink on light surfaces, paper on dark ones. The badge is always ink. */
  tone?: "ink" | "paper";
  circle?: boolean;
  animate?: boolean;
  className?: string;
}

const EASE = [0.65, 0, 0.35, 1] as const;

export function LogoMark({
  tone = "ink",
  circle = false,
  animate = false,
  className = "",
}: LogoMarkProps) {
  const colour = tone === "paper" && !circle ? "var(--color-paper)" : "var(--color-ink)";

  /* A letter's outline draws itself, then the ink fills it. The static
     logo is simply the end state. */
  const letter = (d: string, delay: number) =>
    animate ? (
      <motion.path
        key={d}
        d={d}
        stroke={colour}
        strokeWidth="1.2"
        initial={{ pathLength: 0, fillOpacity: 0 }}
        animate={{ pathLength: 1, fillOpacity: 1 }}
        transition={{
          pathLength: { delay, duration: 0.6, ease: EASE },
          fillOpacity: { delay: delay + 0.45, duration: 0.35 },
        }}
      />
    ) : (
      <path key={d} d={d} />
    );

  const wordmark = (
    <g fill={colour} fillRule="evenodd">
      {THE.map((d, index) => letter(d, 0.5 + index * 0.15))}
      {WORD.map((d, index) => letter(d, 0.85 + index * 0.08))}
      {SUB.map((d, index) => letter(d, 1.65 + index * 0.08))}
      {REG.map((d) => letter(d, 2.05))}
    </g>
  );

  if (!circle) {
    return (
      <svg
        viewBox="24 175 472 165"
        role="img"
        aria-label="The Male Order Erise"
        className={className}
      >
        {wordmark}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 512 512" role="img" aria-label="The Male Order Erise" className={className}>
      <circle cx="256" cy="256" r="256" fill="#ffffff" />
      {/* The rim draws itself round in the intro, then fades into the disc. */}
      {animate ? (
        <motion.circle
          cx="256"
          cy="256"
          r="253"
          fill="none"
          stroke={colour}
          strokeWidth="5"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: 1, opacity: [1, 1, 0] }}
          transition={{ pathLength: { duration: 1, ease: EASE }, opacity: { duration: 2.6, times: [0, 0.85, 1] } }}
        />
      ) : null}
      {wordmark}
    </svg>
  );
}
