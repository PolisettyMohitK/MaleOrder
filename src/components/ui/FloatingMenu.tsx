"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { GENERAL_ENQUIRY, waLink } from "@/lib/whatsapp";
import {
  SILK,
  surfaceFade,
  surfaceSpring,
  surfaceStagger,
  withReduce,
} from "@/components/motion/surface";
import { Logo } from "./Logo";
import {
  ArrowUpRightIcon,
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "./Icons";

export interface FloatingMenuLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FloatingMenuProps {
  primaryLinks: FloatingMenuLink[];
  secondaryLinks?: FloatingMenuLink[];
  socialLinks?: FloatingMenuLink[];
  title?: ReactNode;
  className?: string;
  /** Trigger colour — "bone" while the header sits transparent over the hero. */
  tone?: "ink" | "bone";
  /** Controlled by the header, so it can close the menu when search takes over. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Fixed panel width. The anchor maths below assumes it. */
const PANEL_WIDTH = 336;
const GUTTER = 12;

/**
 * Floating menu.
 *
 * A trigger that opens a floating panel anchored beneath it, with the links
 * staggering in on a spring. The scrim only tints — the page stays visible
 * behind the panel, so a shopper who opened the menu by mistake keeps their
 * place.
 *
 * Adapted to this store rather than dropped in: the links, wordmark and social
 * row come from store.config.ts and the product data, the panel wears the
 * black/silver house style, and every rule in components/motion/surface.ts
 * drives it — the same transition the search overlay, lightbox and size guide
 * use, so the whole site opens surfaces the same way.
 *
 * The panel and scrim are portalled to <body>. The header carries
 * `backdrop-blur`, which creates a stacking context, so a fixed child of it
 * cannot paint above the page no matter how high its z-index is.
 */
/** No-op subscription: this reads the environment, it does not watch it. */
const neverChanges = () => () => {};

export function FloatingMenu({
  primaryLinks,
  secondaryLinks = [],
  socialLinks = [],
  title,
  className = "",
  tone = "ink",
  open,
  onOpenChange,
}: FloatingMenuProps) {
  const reduce = useReducedMotion();
  const [anchor, setAnchor] = useState<{ left: number; top: number } | null>(null);

  /* React's server renderer cannot create portals, so gate on the client.
     Read from the environment rather than set in an effect. */
  const mounted = useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const panelId = useId();

  const ink = tone === "bone" ? "text-bone" : "text-ink";

  /* Anchor the panel under the trigger instead of centring it, so it reads as
     attached to the button that opened it. Measured on open and on resize. */
  useLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const box = triggerRef.current?.getBoundingClientRect();
      if (!box) return;
      const left = Math.max(
        GUTTER,
        Math.min(box.left, window.innerWidth - PANEL_WIDTH - GUTTER),
      );
      setAnchor({ left, top: box.bottom + 10 });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  /* Return focus to the trigger on close, but never steal it on first mount. */
  useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const panel = (
    <motion.div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        tabIndex={-1}
        style={anchor ? { left: anchor.left, top: anchor.top } : undefined}
        className="on-dark fixed z-[96] max-h-[calc(100dvh-6rem)] w-[min(21rem,calc(100vw-1.5rem))] origin-top-left overflow-y-auto rounded-[18px] border border-white/12 bg-ink/97 p-5 shadow-[0_34px_90px_-28px_rgba(0,0,0,0.85)] outline-none"
        initial={{ opacity: 0, scale: reduce ? 1 : 0.9, y: reduce ? 0 : -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: reduce ? 1 : 0.95, y: reduce ? 0 : -6 }}
        transition={withReduce(reduce, surfaceSpring)}
      >
        {title ?? <Logo tone="silver" size="sm" />}

        <nav aria-label="Menu" className="mt-5">
          <ul>
            {primaryLinks.map((link, index) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={withReduce(reduce, surfaceStagger(index))}
              >
                <Link
                  href={link.href}
                  onClick={() => onOpenChange(false)}
                  className="group flex items-center justify-between gap-3 border-b border-white/8 py-3"
                >
                  <span className="t-head shine text-bone">{link.label}</span>
                  <ArrowUpRightIcon
                    width={18}
                    height={18}
                    className="shrink-0 text-silver-400 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-1"
                  />
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        {secondaryLinks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={withReduce(
              reduce,
              surfaceStagger(primaryLinks.length),
            )}
          >
            <p className="label mt-6 text-silver-400">Also</p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              {secondaryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => onOpenChange(false)}
                    className="link-draw label py-1 text-bone/80 transition-colors duration-500 hover:text-bone"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}

        {socialLinks.length > 0 ? (
          <motion.div
            className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={withReduce(reduce, { duration: 0.5, delay: 0.28, ease: SILK })}
          >
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                aria-label={link.label}
                className="tap flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-silver-300 transition-colors duration-500 hover:border-silver-200 hover:text-bone"
              >
                {link.label.toLowerCase().includes("instagram") ? (
                  <InstagramIcon width={18} height={18} />
                ) : link.label.toLowerCase().includes("facebook") ? (
                  <FacebookIcon width={18} height={18} />
                ) : link.label.toLowerCase().includes("whatsapp") ? (
                  <WhatsAppIcon width={18} height={18} />
                ) : null}
              </a>
            ))}
          </motion.div>
        ) : null}

        <motion.a
          href={waLink(GENERAL_ENQUIRY)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-paper mt-6 w-full"
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={withReduce(
            reduce,
            surfaceStagger(primaryLinks.length + 1, 0.03, 0.16),
          )}
        >
          <WhatsAppIcon width={16} height={16} />
          Order on WhatsApp
        </motion.a>
    </motion.div>
  );

  const scrim = (
    /* Clicking away closes, like every other surface here. Excluded from the
       tab order — Escape and the trigger already offer keyboard ways out. */
    <motion.button
      key="scrim"
      type="button"
      tabIndex={-1}
      aria-label="Close menu"
      onClick={() => onOpenChange(false)}
      className="fixed inset-0 z-[94] cursor-default bg-ink/65 backdrop-blur-[3px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={withReduce(reduce, surfaceFade)}
    />
  );

  return (
    <div className={`relative ${className}`}>
      {/* Trigger. The two rules rotate into an X on the same easing curve. */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close menu" : "Open menu"}
        className={`tap -ml-2 flex h-11 w-11 items-center justify-center transition-colors duration-500 ${ink} hover:text-silver-400`}
      >
        {/* Both rules share one centre line, so ±45° lands as a clean X. */}
        <span className="relative block h-3 w-5" aria-hidden="true">
          <motion.span
            className="absolute inset-x-0 top-1/2 block h-px bg-current"
            style={{ marginTop: "-0.5px" }}
            animate={{ rotate: open ? 45 : 0 }}
            transition={withReduce(reduce, surfaceSpring)}
          />
          <motion.span
            className="absolute inset-x-0 top-1/2 block h-px bg-current"
            style={{ marginTop: "-0.5px" }}
            animate={{ rotate: open ? -45 : 0 }}
            transition={withReduce(reduce, surfaceSpring)}
          />
        </span>
      </button>

      {/* Portalled so the panel escapes the header's backdrop-blur stacking
          context. Each surface gets its own AnimatePresence, because a
          Fragment child is not tracked for exit. `open` is false on the server
          and `mounted` gates the first client render, so document is only ever
          touched on the client — and the portal stays in place while the exit
          animation plays. */}
      {mounted
        ? createPortal(
            <>
              <AnimatePresence>{open ? scrim : null}</AnimatePresence>
              <AnimatePresence>{open ? panel : null}</AnimatePresence>
            </>,
            document.body,
          )
        : null}
    </div>
  );
}