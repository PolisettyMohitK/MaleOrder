"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

export { gsap, ScrollTrigger, useGSAP, SplitText };

/** Shared easing. One curve everywhere so the motion feels like one system. */
export const EASE = "power3.out";
export const EASE_SOFT = "power2.out";

/**
 * Every duration the site uses, in seconds. Centralised so the tempo can be
 * tuned in one place — a slow editorial feel, never snappy.
 */
export const DURATION = {
  fast: 0.5,
  base: 0.8,
  slow: 1.2,
} as const;

/**
 * Plugin registration. Called from inside useGSAP so it only ever runs on
 * the client — ScrollTrigger and SplitText both touch `window` on import.
 */
export function registerPlugins() {
  gsap.registerPlugin(ScrollTrigger, useGSAP, SplitText);
}