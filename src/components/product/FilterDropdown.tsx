"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { ChevronDownIcon } from "@/components/ui/Icons";
import {
  surfaceSpring,
  surfaceStagger,
  withReduce,
} from "@/components/motion/surface";

export interface FilterOption {
  value: string;
  label: string;
  /** Colour swatch, taken from the catalogue so it stays single-sourced. */
  hex?: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  /** Currently active values. One entry in `single` mode. */
  selected: string[];
  onToggle: (value: string) => void;
  /** Single-select mode. Used by Sort; renders radio semantics. */
  single?: boolean;
  /** Rendered left of the label, e.g. the leading "Sort". */
  prefix?: ReactNode;
  className?: string;
}

/* How long the pointer may leave the panel before it closes. Long enough to
   travel from the trigger into the panel, short enough not to feel stuck. */
const HOVER_GRACE = 140;

/* Mirrors the panel's own max-height, so the flip measurement agrees with what
   actually renders. */
const PANEL_MAX = 22 * 16; /* 22rem, the panel's max-h */

/**
 * A filter group collapsed into a single trigger that opens a floating panel.
 *
 * WHY IT IS NOT HOVER-ONLY
 * -----------------------
 * Hover opens it, because that is the quickest path for a mouse and it is what
 * was asked for — but a hover-only menu is unreachable by keyboard and by
 * touch. So Enter and Space also open it (a touch tap does nothing on hover
 * alone), Tab moves focus into the open panel, and Escape closes it and hands
 * focus back to the trigger. Hover is an extra way in, not the only way in.
 *
 * Opening on focus was tried and taken out: it made Tab alone spring the panel
 * open, and the next Enter — the obvious "activate" key — then toggled it shut
 * again, so a keyboard user who pressed Enter got nothing for their trouble.
 * A button that opens on activation is the pattern the floating menu already
 * uses, and it leaves the tab order quiet.
 *
 * The panel wears exactly the floating menu's surface — ink at 97%, an 18px
 * radius, a 12% white hairline, and the same 34px-90px drop shadow — and
 * animates through the same four surface constants, so opening a filter and
 * opening the site menu read as one gesture. That means the trigger itself
 * stays light: ink text on paper, going ink-on-bone when open.
 *
 * Not portalled, unlike the floating menu. That one had to escape the header's
 * `backdrop-blur`, which makes a stacking context; this one sits in the page
 * body with no such ancestor, and keeping it in flow is what lets pointer
 * travel from trigger to panel pass through a single mouseenter/mouseleave.
 */
export function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
  single = false,
  prefix,
  className = "",
}: FilterDropdownProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [flip, setFlip] = useState(false);
  const grace = useRef<number | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const cancelGrace = () => window.clearTimeout(grace.current);

  function closeNow() {
    cancelGrace();
    setOpen(false);
  }

  function openNow() {
    cancelGrace();
    setOpen(true);
  }

  /* Pointer: open on enter, close on leave, through a short grace period so
     travelling into the panel does not slam it shut on the way. */
  function handleEnter() {
    openNow();
  }
  function handleLeave() {
    cancelGrace();
    grace.current = window.setTimeout(() => setOpen(false), HOVER_GRACE);
  }

  /* Decide which way to open before the panel paints, so it never appears in
     the wrong place for one frame. Mirrors the panel's own max height. */
  useLayoutEffect(() => {
    if (!open) return;
    const box = triggerRef.current?.getBoundingClientRect();
    if (!box) return;
    const below = window.innerHeight - box.bottom;
    const above = box.top;
    setFlip(below < PANEL_MAX + 8 && above > below);
  }, [open]);

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape" || !open) return;
    event.stopPropagation();
    window.clearTimeout(grace.current);
    setOpen(false);
    triggerRef.current?.focus();
  }

  /* An outside pointer press dismisses it, so the panel never traps the
     pointer against a single stray option. Reads the ref and calls setState
     directly rather than closing through `closeNow`, which would be a new
     function every render and re-attach this listener constantly. */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      window.clearTimeout(grace.current);
      setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  /* Clear a pending grace close if the panel unmounts first. */
  useEffect(() => () => window.clearTimeout(grace.current), []);

  const activeCount = selected.length;
  const currentLabel = single ? selected[0] : undefined;

  const triggerClasses = [
    "tap label inline-flex items-center gap-2 rounded-full border px-4 py-2.5 transition-colors duration-300",
    open
      ? "border-ink text-ink"
      : activeCount > 0
        ? "border-ink/40 text-ink hover:border-ink"
        : "border-silver-500/35 text-neutral-600 hover:border-ink hover:text-ink",
  ].join(" ");

  return (
    <div
      ref={rootRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => (open ? closeNow() : openNow())}
        className={triggerClasses}
      >
        {prefix ? <span className="text-muted">{prefix}</span> : null}
        <span>{label}</span>

        {currentLabel ? (
          <span className="text-ink">{currentLabel}</span>
        ) : activeCount > 0 ? (
          <span className="tabular-nums text-ink">{activeCount}</span>
        ) : null}

        <ChevronDownIcon
          width={12}
          height={12}
          aria-hidden
          className={`shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            role={single ? "radiogroup" : "group"}
            aria-label={label}
            tabIndex={-1}
            initial={{
              opacity: 0,
              scale: reduce ? 1 : 0.96,
              y: reduce ? 0 : -8,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.97, y: reduce ? 0 : -4 }}
            transition={withReduce(reduce, surfaceSpring)}
            style={{ transformOrigin: flip ? "bottom left" : "top left" }}
            className={`on-dark absolute left-0 z-50 max-h-[min(22rem,55vh)] min-w-[13rem] overflow-y-auto rounded-[18px] border border-white/12 bg-ink/97 p-2 shadow-[0_34px_90px_-28px_rgba(0,0,0,0.85)] ${
              flip ? "bottom-[calc(100%+0.5rem)]" : "top-[calc(100%+0.5rem)]"
            }`}
          >
            {options.map((option, index) => {
              const active = selected.includes(option.value);

              return (
                <motion.button
                  key={option.value}
                  type="button"
                  role={single ? "radio" : undefined}
                  aria-checked={single ? active : undefined}
                  aria-pressed={single ? undefined : active}
                  onClick={() => {
                    onToggle(option.value);
                    /* Single-select is a decision, not a collection: the
                       choice is made the moment it is clicked. */
                    if (single) closeNow();
                  }}
                  initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={withReduce(reduce, surfaceStagger(index))}
                  className={`tap flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors duration-300 ${
                    active
                      ? "bg-white/10 text-bone"
                      : "text-silver-300 hover:bg-white/8 hover:text-bone"
                  }`}
                >
                  {option.hex ? (
                    <span
                      aria-hidden
                      className="size-3 shrink-0 rounded-full border border-white/25"
                      style={{ backgroundColor: option.hex }}
                    />
                  ) : null}

                  <span className="label flex-1">{option.label}</span>

                  {active ? (
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 rounded-full bg-bone"
                    />
                  ) : null}
                </motion.button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
