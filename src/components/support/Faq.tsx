"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { PlusIcon } from "@/components/ui/Icons";

export interface FaqItem {
  question: string;
  answer: string;
}

/** Accordion with a smooth height transition. One panel open at a time. */
export function Faq({ items }: { items: FaqItem[] }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className="border-t border-silver-500/25">
      {items.map((item, index) => {
        const isOpen = open === index;

        return (
          <li key={item.question} className="border-b border-silver-500/25">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                id={`faq-trigger-${index}`}
                className="tap flex w-full items-center justify-between gap-6 py-6 text-left transition-colors duration-500 hover:text-muted"
              >
                <span className="font-display text-xl font-light tracking-tight md:text-2xl">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full border border-silver-500/40 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "rotate-45 border-ink" : ""
                  }`}
                >
                  <PlusIcon width={15} height={15} />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="panel"
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: reduce ? 0 : 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="overflow-hidden"
                >
                  <p className="t-body max-w-2xl pb-7 text-neutral-600">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}