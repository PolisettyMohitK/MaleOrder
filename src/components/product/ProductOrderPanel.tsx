"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Product } from "@/data/products";
import { sizeGuide, sizeGuideNotes } from "@/data/size-guide";
import { placeLine, store } from "@/data/store.config";
import { lockScroll } from "@/lib/scroll";
import { orderMessage, waLink } from "@/lib/whatsapp";
import { surfaceFade, surfaceSlide, withReduce } from "@/components/motion/surface";
import { CloseIcon, WhatsAppIcon } from "@/components/ui/Icons";

/** Shown under the order button, so nobody has to guess what happens next. */
const ORDER_STEPS = [
  "Your message opens in WhatsApp with the piece, size and colour already filled in.",
  "We reply with availability and confirm the size with you.",
  "Pay on delivery, or collect from the shop.",
];

/**
 * Size, colour and the order button. This is the whole conversion on the
 * page: pick a size, tap Order on WhatsApp, and the message is already
 * written for the shop.
 */
export function ProductOrderPanel({ product }: { product: Product }) {
  const reduce = useReducedMotion();
  const [size, setSize] = useState<string | null>(null);
  const [colour, setColour] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    lockScroll(guideOpen);
    return () => lockScroll(false);
  }, [guideOpen]);

  useEffect(() => {
    if (!guideOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setGuideOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [guideOpen]);

  const href = waLink(orderMessage(product.name, { size, colour }));

  return (
    <>
      {/* Colour */}
      <fieldset>
        <legend className="label flex w-full items-baseline justify-between text-muted">
          Colour
          <span className="text-ink">{colour ?? "Choose one"}</span>
        </legend>
        <ul className="mt-4 flex flex-wrap gap-3">
          {product.colours.map((option) => {
            const selected = colour === option.name;
            return (
              <li key={option.name}>
                <button
                  type="button"
                  onClick={() => setColour(option.name)}
                  aria-pressed={selected}
                  aria-label={option.name}
                  title={option.name}
                  className={`flex size-11 items-center justify-center rounded-full border transition-all duration-500 ${
                    selected ? "border-ink" : "border-transparent hover:border-silver-500"
                  }`}
                >
                  <span
                    className="size-7 rounded-full border border-black/10"
                    style={{ backgroundColor: option.hex }}
                  />
                  <span className="sr-only">{option.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>

      {/* Size */}
      <fieldset className="mt-9">
        <legend className="label flex w-full items-baseline justify-between text-muted">
          Size
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="label link-draw text-ink"
          >
            Size guide
          </button>
        </legend>
        <ul className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {product.sizes.map((option) => {
            const selected = size === option;
            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => setSize(option)}
                  aria-pressed={selected}
                  className={`tap flex w-full items-center justify-center border text-xs tracking-[0.1em] transition-colors duration-500 ${
                    selected
                      ? "border-ink bg-ink text-paper"
                      : "border-silver-500/40 text-neutral-600 hover:border-ink hover:text-ink"
                  }`}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
        {size === null ? (
          <p className="label mt-4 text-muted">
            No size selected — we will confirm your size on WhatsApp.
          </p>
        ) : null}
      </fieldset>

{/* Actions */}
      <div className="mt-10 flex flex-col gap-3">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ink w-full"
        >
          <WhatsAppIcon width={16} height={16} />
          Order on WhatsApp
        </a>
        <Link href="/support#visit" className="btn btn-ghost w-full">
          Visit the store
        </Link>
      </div>

      {/* The two objections that stop an order, answered where they happen. */}
      <ul className="mt-7 flex flex-col gap-3">
        {[
          "Free alterations in store, usually same day",
          "Message us first — nothing is charged on this site",
          `Collect in ${placeLine} or have it delivered`,
        ].map((note) => (
          <li key={note} className="t-body flex items-start gap-3 text-neutral-600">
            <span
              aria-hidden="true"
              className="mt-2.5 size-1 shrink-0 rounded-full bg-silver-400"
            />
            {note}
          </li>
        ))}
      </ul>

      {/* What actually happens after they tap the button. */}
      <div className="mt-9 border-t border-silver-500/25 pt-7">
        <p className="label text-muted">What happens next</p>
        <ol className="mt-5 flex flex-col gap-3">
          {ORDER_STEPS.map((step, index) => (
            <li key={step} className="t-body flex items-start gap-4 text-neutral-600">
              <span className="type-silver font-display text-lg leading-none">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="t-body mt-6 text-neutral-500">
          No payment on this site. Message us, we confirm availability and size,
          and you pay when it reaches you — or when you collect it in{" "}
          {placeLine}.
        </p>
      </div>

      {/* Size guide side panel */}
      <AnimatePresence>
        {guideOpen && (
          <motion.div
            className="on-dark fixed inset-0 z-[110] flex justify-end bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={withReduce(reduce, surfaceFade)}
            onClick={() => setGuideOpen(false)}
          >
            <motion.div
              className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-paper"
              role="dialog"
              aria-modal="true"
              aria-label="Size guide"
              initial={{ x: reduce ? 0 : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: reduce ? 0 : "100%" }}
              transition={withReduce(reduce, surfaceSlide)}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-silver-500/20 px-6">
                <h2 className="label text-ink">Size guide</h2>
                <button
                  type="button"
                  onClick={() => setGuideOpen(false)}
                  aria-label="Close size guide"
                  className="tap -mr-2 flex items-center px-2 text-ink"
                >
                  <CloseIcon width={20} height={20} />
                </button>
              </div>

              <div className="px-6 py-8">
                <table className="w-full border-collapse text-sm">
                  <caption className="sr-only">
                    Chest and waist measurements in inches, by size
                  </caption>
                  <thead>
                    <tr className="border-b border-silver-500/30 text-left">
                      <th scope="col" className="label py-3 font-normal text-muted">
                        Size
                      </th>
                      <th scope="col" className="label py-3 font-normal text-muted">
                        Chest
                      </th>
                      <th scope="col" className="label py-3 font-normal text-muted">
                        Waist
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeGuide.map((row) => (
                      <tr
                        key={row.size}
                        className={`border-b border-silver-500/15 transition-colors duration-500 ${
                          size === row.size ? "bg-bone" : ""
                        }`}
                      >
                        <th scope="row" className="py-4 text-left font-normal">
                          {row.size}
                          {size === row.size ? (
                            <span className="ml-2 text-xs text-muted">
                              selected
                            </span>
                          ) : null}
                        </th>
                        <td className="py-4 text-neutral-600">{row.chest}&Prime;</td>
                        <td className="py-4 text-neutral-600">{row.waist}&Prime;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <ul className="mt-8 flex flex-col gap-4">
                  {sizeGuideNotes.map((note) => (
                    <li key={note} className="t-body flex gap-3 text-neutral-600">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 size-1 shrink-0 rounded-full bg-silver-400"
                      />
                      {note}
                    </li>
                  ))}
                </ul>

                <a
                  href={waLink(`Hi, I'd like help with sizing for ${product.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ink mt-9 w-full"
                >
                  <WhatsAppIcon width={15} height={15} />
                  Ask about my size
                </a>

                <p className="t-body mt-6 text-neutral-600">
                  Or come in and we will measure you properly. The shop is on{" "}
                  {store.area} Main Road, {store.city}.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}