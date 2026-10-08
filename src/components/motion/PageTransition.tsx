"use client";

import { ViewTransition } from "react";
import type { ReactNode } from "react";

/**
 * Soft cross-fade between routes, using React's native View Transitions.
 *
 * Why this and not a hand-rolled GSAP overlay: `<ViewTransition>` activates
 * automatically for App Router navigations, needs no configuration, and
 * handles pairing the outgoing and incoming page. Doing that by hand in GSAP
 * means intercepting the navigation and coordinating mount/unmount, which is
 * exactly the kind of thing that goes wrong on back/forward.
 *
 * It has to live in a page (or a per-segment template), not the root layout:
 * layouts persist across navigation, so their animations never fire.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <ViewTransition default="page-fade">{children}</ViewTransition>;
}