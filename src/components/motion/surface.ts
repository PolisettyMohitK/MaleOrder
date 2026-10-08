import type { Transition } from "motion/react";

/**
 * The site's "surface open" motion vocabulary.
 *
 * Every click-to-reveal surface — the floating menu, the search overlay, the
 * product lightbox, the size guide — animates from these four constants so the
 * whole site moves as one gesture instead of four unrelated ones.
 *
 * Sourced from the floating menu: a spring for the panel, a short fade for the
 * scrim behind it, and a staggered silk rise for the children.
 */

/** The site easing curve. Mirrors --ease-silk and the .btn transition. */
export const SILK: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** The panel itself. A little overshoot makes it feel physical. */
export const surfaceSpring: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 32,
  mass: 0.9,
};

/** The scrim behind the panel. Fast — it should never be the thing you wait for. */
export const surfaceFade: Transition = { duration: 0.3, ease: "easeOut" };

/** Children that slide rather than spring (side panels, drawers). */
export const surfaceSlide: Transition = { duration: 0.5, ease: SILK };

/** Staggered rise for a list inside a surface. Index 0 lands just after the panel. */
export function surfaceStagger(index: number, step = 0.035, base = 0.05): Transition {
  return { duration: 0.5, delay: base + index * step, ease: SILK };
}

/**
 * Collapse a transition to nothing for visitors who asked for reduced motion.
 *
 * Deliberately explicit rather than relying on the CSS kill-switch: motion
 * animates inline styles in JavaScript, so the stylesheet override in
 * globals.css does not reach it. Without this, a reduced-motion visitor would
 * still sit through the stagger delays — the content would arrive late, which
 * is worse than it simply arriving at once.
 */
export function withReduce(
  reduce: boolean | null,
  transition: Transition,
): Transition {
  return reduce ? { duration: 0 } : transition;
}