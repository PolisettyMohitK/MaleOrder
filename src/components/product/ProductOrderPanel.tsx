"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Product } from "@/data/products";
import { sizeGuide, sizeGuideNotes } from "@/data/size-guide";
import { placeLine, store } from "@/data/store.config";
import { addToBag } from "@/lib/bag";
import { lockScroll } from "@/lib/scroll";
import { orderMessage, sizeHelpMessage, waLink } from "@/lib/whatsapp";
import { surfaceFade, surfaceSlide, withReduce } from "@/components/motion/surface";
import {
  BagIcon,
  CashIcon,
  CloseIcon,
  FitIcon,
  StoreIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";

/** Shown under the order button, so nobody has to guess what happens next. */
const ORDER_STEPS = [
  "WhatsApp opens with this piece, size and colour filled in.",
  "We reply to confirm stock and size.",
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
  /* One colourway means there is nothing to choose, so it starts selected. */
  const [colour, setColour] = useState<string | null>(
    product.colours.length === 1 ? product.colours[0].name : null,
  );
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

  const href = waLink(orderMessage({ product, size, colour, qty: 1 }));
  const add = () => addToBag({ slug: product.slug, size, colour });

  return (
    <>
      {/* Colour */}
      <fieldset>
        <legend className="flex w-full items-baseline justify-between text-sm font-semibold text-ink">
          Colour
          <span className="font-normal text-muted">{colour ?? "Choose one"}</span>
        </legend>
        <ul className="mt-3 flex flex-wrap gap-3">
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
      <fieldset className="mt-7">
        <legend className="flex w-full items-baseline justify-between text-sm font-semibold text-ink">
          Size
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="text-sm font-medium text-ink underline underline-offset-4 hover:text-accent"
          >
            Size guide
          </button>
        </legend>
        <ul className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {product.sizes.map((option) => {
            const selected = size === option;
            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => setSize(option)}
                  aria-pressed={selected}
                  className={`tap flex h-12 w-full items-center justify-center rounded-sm border text-sm font-medium transition-colors duration-300 ${
                    selected
                      ? "border-ink bg-ink text-paper"
                      : "border-silver-500/50 bg-paper text-ink hover:border-ink"
                  }`}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
        {size === null ? (
          <p className="mt-3 text-sm text-muted">
            Not sure? Skip it and we will help you on WhatsApp.
          </p>
        ) : null}
      </fieldset>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-wa hidden w-full lg:inline-flex"
        >
          <WhatsAppIcon width={18} height={18} />
          Order on WhatsApp
        </a>
        {/* Phones order from the pinned bar, so the WhatsApp button above is desktop only. */}
        <button type="button" onClick={add} className="btn btn-ghost w-full">
          <BagIcon width={18} height={18} />
          Add to bag
        </button>
        <p className="text-center text-sm text-muted">
          Want to try it first?{" "}
          <Link
            href="/support#visit"
            className="font-medium text-ink underline underline-offset-4"
          >
            Visit the store
          </Link>
        </p>
      </div>

      {/* The objections that stop an order, answered where they happen. */}
      <ul className="mt-6 flex flex-col gap-3 rounded-sm bg-bone p-4">
        {[
          { Icon: FitIcon, text: "Free alterations in store, usually same day" },
          { Icon: CashIcon, text: "Nothing to pay here — pay on delivery" },
          { Icon: StoreIcon, text: `Collect in ${placeLine} or get it delivered` },
        ].map(({ Icon, text }) => (
          <li key={text} className="flex items-center gap-3 text-sm text-ink">
            <Icon width={20} height={20} className="shrink-0 text-accent" />
            {text}
          </li>
        ))}
      </ul>

      {/* What actually happens after they tap the button. */}
      <div className="mt-8 border-t border-silver-500/25 pt-6">
        <p className="text-base font-semibold text-ink">What happens next</p>
        <ol className="mt-4 flex flex-col gap-3">
          {ORDER_STEPS.map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-sm text-muted">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-paper">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Pinned order bar, phones and tablets only. Always shown and never
          animated: sliding it in and out as the main button scrolled past
          made it jump up and down. The floating WhatsApp button is hidden on
          product pages so the two never stack. */}
      <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-black/10 bg-paper/95 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{product.name}</p>
            <p className="mt-0.5 text-xs text-muted">
              {[size && `Size ${size}`, colour].filter(Boolean).join(" · ") ||
                "Size confirmed on chat"}
            </p>
          </div>
          <button
            type="button"
            onClick={add}
            aria-label="Add to bag"
            className="flex size-12 shrink-0 items-center justify-center rounded-full border border-silver-500/50 text-ink"
          >
            <BagIcon width={20} height={20} />
          </button>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa shrink-0 px-5"
          >
            <WhatsAppIcon width={17} height={17} />
            Order
          </a>
        </div>
      </div>

      {/* Size guide side panel */}
      <AnimatePresence>
        {guideOpen && (
          <motion.div
            className="fixed inset-0 z-[110] flex justify-end bg-ink/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={withReduce(reduce, surfaceFade)}
            onClick={() => setGuideOpen(false)}
          >
            <motion.div
              data-lenis-prevent
              className="flex h-full w-full max-w-md flex-col overflow-y-auto overscroll-contain bg-paper"
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
                  href={waLink(sizeHelpMessage(product, size))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa mt-9 w-full"
                >
                  <WhatsAppIcon width={17} height={17} />
                  Ask about my size
                </a>

                <p className="t-body mt-6 text-neutral-600">
                  Or come in and we will measure you properly. The shop is on{" "}
                  {store.address.line2}, {store.city}.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}