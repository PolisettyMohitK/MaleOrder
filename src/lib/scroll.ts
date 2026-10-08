import type Lenis from "lenis";

/* Holds the single Lenis instance so any overlay can pause the page. */

let instance: Lenis | null = null;

export function registerLenis(next: Lenis | null) {
  instance = next;
}

/** Freezes page scrolling while a full-screen overlay is open. */
export function lockScroll(locked: boolean) {
  const root = document.documentElement;

  if (locked) {
    instance?.stop();
    root.style.overflow = "hidden";
    return;
  }

  root.style.overflow = "";
  instance?.start();
  // Lenis caches the page height, so it needs a nudge after we unlock.
  instance?.resize();
}

/** Scrolls to an element or offset, using Lenis when it is running. */
export function scrollTo(target: string | number, offset = 0) {
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.2 });
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({ top: target });
    return;
  }

  document.querySelector(target)?.scrollIntoView({ block: "start" });
}