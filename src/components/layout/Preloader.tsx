"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Logo } from "@/components/ui/Logo";
import { fullName } from "@/data/store.config";
import { lockScroll } from "@/lib/scroll";

/** The intro plays once per browser session, not on every page. */
const SESSION_KEY = "mob-intro-seen";

/** How long the mark sits on screen before the panel lifts away. */
const HOLD_MS = 820;
const LIFT_MS = 700;

/* The stored value never changes within a session, so there is nothing to
   subscribe to — we only need a safe client snapshot. */
const noopSubscribe = () => () => {};

function getClientSnapshot() {
  if (typeof window === "undefined") return false;
  try {
    if (new URLSearchParams(window.location.search).get("intro") === "1") return true;
    return window.sessionStorage.getItem(SESSION_KEY) !== "1";
  } catch {
    return false;
  }
}

/** Never render the intro in the server HTML. */
const getServerSnapshot = () => false;

export function Preloader() {
  const reduce = useReducedMotion();
  const fresh = useSyncExternalStore(noopSubscribe, getClientSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);

  const visible = fresh && !reduce && !dismissed;

  const dismiss = useCallback(() => setDismissed(true), []);

  /* Scroll lock and the session flag are writes to the outside world, which
     is exactly what an effect is for. */
  useEffect(() => {
    if (!visible) return;
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* private mode — nothing to remember */
    }
    lockScroll(true);
    return () => lockScroll(false);
  }, [visible]);

  /* Auto-dismiss so the intro always completes on its own. */
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(dismiss, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [visible, dismiss]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  return (
    <AnimatePresence onExitComplete={() => lockScroll(false)}>
      {visible && (
        <motion.div
          className="on-dark fixed inset-0 z-[120] flex items-center justify-center bg-ink"
          exit={{ y: "-100%" }}
          transition={{ duration: LIFT_MS / 1000, ease: [0.76, 0, 0.24, 1] }}
          onClick={dismiss}
          role="status"
          aria-label={`Loading ${fullName}`}
        >
          <motion.div
            className="px-6"
            initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <Logo tone="silver" size="lg" />
          </motion.div>

          <motion.span
            className="label absolute bottom-10 left-1/2 -translate-x-1/2 text-silver-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.4, times: [0, 0.2, 0.7, 1] }}
          >
            Tap to skip
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}