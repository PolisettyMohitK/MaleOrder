"use client";

import { animate, motion, useMotionValue } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { getCategory } from "@/data/products";
import { useBag } from "@/lib/bag";
import { collectionEnquiry, GENERAL_ENQUIRY, waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icons";

/** Pages that already carry their own WhatsApp button. */
const HIDDEN_ON = ["/products/", "/support"];

/** Header plus announcement bar. The hero button "reaches the top" here. */
const HEADER_BOTTOM = 108;

/** Where the corner button rests, for the current window size. */
function corner() {
  const wide = window.innerWidth >= 640;
  const size = wide ? 64 : 56;
  const gap = wide ? 32 : 20;
  return {
    x: window.innerWidth - gap - size,
    y: window.innerHeight - gap - size,
    w: size,
    h: size,
  };
}

/**
 * The one WhatsApp button on screen while browsing.
 *
 * On the home page it starts life as the hero's "Order on WhatsApp" button.
 * When that button scrolls up to the header, this one takes its exact place
 * and size and, on its own, shrinks, drops its label and flies down into the
 * bottom-right corner as a circle. Scrolling back up past that line sends
 * it back to the hero the same way.
 *
 * It hides on pages that have their own WhatsApp button and while the bag
 * is open, so there is never more than one on screen.
 */
export function FloatingWhatsApp() {
  const pathname = usePathname();
  const { open: bagOpen } = useBag();

  if (HIDDEN_ON.some((path) => pathname.startsWith(path))) return null;

  const slug = pathname.match(/^\/collections\/([^/]+)/)?.[1];
  const category = slug ? getCategory(slug) : undefined;
  const href = waLink(
    category ? collectionEnquiry(category.name) : GENERAL_ENQUIRY,
  );

  return pathname === "/" ? (
    <MorphingButton href={href} hidden={bagOpen} />
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message us on WhatsApp"
      className={`fixed right-5 bottom-5 z-[60] flex size-14 items-center justify-center rounded-full bg-ink text-paper shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 sm:right-8 sm:bottom-8 sm:size-16 ${
        bagOpen ? "pointer-events-none opacity-0" : ""
      }`}
    >
      <WhatsAppIcon width={28} height={28} />
    </a>
  );
}

function MorphingButton({ href, hidden }: { href: string; hidden: boolean }) {
  const link = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const width = useMotionValue(56);
  const height = useMotionValue(56);
  const opacity = useMotionValue(0);
  const fill = useMotionValue("rgba(26, 26, 26, 0.55)");
  const edge = useMotionValue("rgba(250, 247, 242, 0.6)");
  const labelWidth = useMotionValue(0);
  const labelOpacity = useMotionValue(1);

  /* 0 = sitting in the hero, 1 = resting in the corner. Animated by time,
     not by scroll: crossing the header line starts the trip. */
  const progress = useMotionValue(0);

  useEffect(() => {
    let labelSize = 0;
    let docked = false;
    let trip: ReturnType<typeof animate> | null = null;
    /* Where the pill leaves from: the hero button's spot as it hit the header. */
    let start = { x: 0, y: HEADER_BOTTOM, w: 0, h: 0 };

    const heroButton = () => document.querySelector<HTMLElement>("[data-wa-hero]");

    const draw = (value: number) => {
      const button = heroButton();
      const node = link.current;
      if (!button || !node) return;

      const active = value > 0;
      button.style.visibility = active ? "hidden" : "";
      node.style.pointerEvents = active ? "" : "none";
      node.tabIndex = active ? 0 : -1;
      node.setAttribute("aria-hidden", String(!active));
      opacity.set(active ? 1 : 0);
      if (!active) return;

      /* On the way back the target is wherever the hero button is now. */
      if (!docked) {
        const rect = button.getBoundingClientRect();
        start = { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
      }

      const end = corner();
      x.set(lerp(start.x, end.x, value));
      y.set(lerp(start.y, end.y, value));
      width.set(lerp(start.w, end.w, value));
      height.set(lerp(start.h, end.h, value));
      labelWidth.set(labelSize * (1 - clamp(value * 1.6)));
      labelOpacity.set(1 - clamp(value * 2.5));
      fill.set(`rgba(26, 26, 26, ${0.55 + 0.45 * value})`);
      edge.set(`rgba(250, 247, 242, ${0.6 * (1 - value)})`);
    };

    const check = () => {
      const button = heroButton();
      if (!button) return;
      if (!labelSize) {
        const label = button.querySelector<HTMLElement>("[data-wa-label]");
        labelSize = (label?.offsetWidth ?? 140) + 10;
      }

      const rect = button.getBoundingClientRect();
      const shouldDock = rect.top < HEADER_BOTTOM;
      if (shouldDock === docked) {
        if (docked && !trip) draw(1);
        return;
      }

      docked = shouldDock;
      if (docked) start = { x: rect.left, y: HEADER_BOTTOM, w: rect.width, h: rect.height };
      trip?.stop();
      trip = animate(progress, docked ? 1 : 0, {
        duration: 0.85,
        ease: [0.65, 0, 0.35, 1],
        onComplete: () => {
          trip = null;
        },
      });
    };

    const unsubscribe = progress.on("change", draw);
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      unsubscribe();
      trip?.stop();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      /* Leaving the page: give the hero button back. */
      const button = heroButton();
      if (button) button.style.visibility = "";
    };
  }, [progress, x, y, width, height, opacity, fill, edge, labelWidth, labelOpacity]);

  return (
    /* The wrapper fades it out while the bag is open. */
    <div
      className={`transition-opacity duration-300 ${hidden ? "pointer-events-none opacity-0" : ""}`}
    >
      <motion.a
        ref={link}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message us on WhatsApp"
        aria-hidden="true"
        tabIndex={-1}
        style={{
          x,
          y,
          width,
          height,
          opacity,
          backgroundColor: fill,
          borderColor: edge,
          pointerEvents: "none",
        }}
        className="fixed top-0 left-0 z-[60] flex items-center justify-center overflow-hidden rounded-full border text-paper shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur-[6px]"
      >
        <WhatsAppIcon width={20} height={20} className="shrink-0" />
        <motion.span
          style={{ width: labelWidth, opacity: labelOpacity }}
          className="block overflow-hidden text-[0.9375rem] font-semibold whitespace-nowrap"
        >
          <span className="block pl-2.5">Order on WhatsApp</span>
        </motion.span>
      </motion.a>
    </div>
  );
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
