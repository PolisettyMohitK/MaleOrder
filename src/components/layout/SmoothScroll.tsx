"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { registerLenis } from "@/lib/scroll";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";

/**
 * Gentle, slow page scrolling, driven by the single GSAP ticker.
 *
 * Lenis no longer runs its own requestAnimationFrame loop. GSAP owns the
 * frame, calls lenis.raf() from it, and ScrollTrigger is fed from the
 * scroll event so pinned and scrubbed animations stay in step with the
 * smoothed position rather than the native one.
 *
 * Opts out entirely when the OS asks for reduced motion, in which case the
 * browser keeps its native scrolling and nothing is hijacked.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      // Exponential ease-out: fast pickup, very long gentle settle.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    registerLenis(lenis);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    /* Lenis only emits "scroll" for the positions it animates itself. Any
       scroll it does not drive — an anchor jump, browser scroll restoration,
       find-in-page, a programmatic scrollTo — would otherwise leave every
       ScrollTrigger stale and the reveals stuck at their start state. */
    const onNativeScroll = () => ScrollTrigger.update();
    window.addEventListener("scroll", onNativeScroll, { passive: true });

    // Lenis caches scroll position, so start every new page at the top.
    lenis.scrollTo(0, { immediate: true });

    return () => {
      window.removeEventListener("scroll", onNativeScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      registerLenis(null);
    };
  }, []);

  // Navigate: jump to the top of the new page without animating through it.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}