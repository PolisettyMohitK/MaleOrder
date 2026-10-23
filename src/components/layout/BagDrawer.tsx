"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { formatPrice, getProduct, productImage } from "@/data/products";
import { bagCount, clearBag, setBagOpen, setQty, useBag } from "@/lib/bag";
import { lockScroll } from "@/lib/scroll";
import { bagMessage, waLink, type OrderLine } from "@/lib/whatsapp";
import { surfaceFade, surfaceSlide, withReduce } from "@/components/motion/surface";
import { CloseIcon, MinusIcon, PlusIcon, WhatsAppIcon } from "@/components/ui/Icons";

/** Side panel listing the bag, with one button that sends it all to WhatsApp. */
export function BagDrawer() {
  const reduce = useReducedMotion();
  const { items, open } = useBag();

  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setBagOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* A product removed from the catalogue just drops out of the bag. */
  const lines = items.flatMap((item, index) => {
    const product = getProduct(item.slug);
    return product ? [{ index, line: { ...item, product } as OrderLine }] : [];
  });
  const count = bagCount(items);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex justify-end bg-ink/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={withReduce(reduce, surfaceFade)}
          onClick={() => setBagOpen(false)}
        >
          <motion.div
            className="flex h-full w-full max-w-md flex-col bg-paper"
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            initial={{ x: reduce ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: reduce ? 0 : "100%" }}
            transition={withReduce(reduce, surfaceSlide)}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-silver-500/20 px-5">
              <h2 className="text-base font-semibold text-ink">
                Your bag{count > 0 ? ` (${count})` : ""}
              </h2>
              <button
                type="button"
                onClick={() => setBagOpen(false)}
                aria-label="Close bag"
                className="tap -mr-2 flex items-center justify-center text-ink"
              >
                <CloseIcon width={20} height={20} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <p className="t-head type-silver">Your bag is empty</p>
                <p className="t-body mt-3 text-muted">
                  Add a few pieces, then send them to us in one WhatsApp message.
                </p>
                <Link
                  href="/#shop"
                  onClick={() => setBagOpen(false)}
                  className="btn btn-ink mt-7"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <>
                <ul
                  data-lenis-prevent
                  className="flex-1 divide-y divide-silver-500/20 overflow-y-auto overscroll-contain px-5"
                >
                  {lines.map(({ index, line }) => (
                    <li key={`${line.product.slug}-${line.size}-${line.colour}`} className="flex gap-4 py-5">
                      <Link
                        href={`/products/${line.product.slug}`}
                        onClick={() => setBagOpen(false)}
                        className="media-frame relative aspect-[3/4] w-20 shrink-0 rounded-sm"
                      >
                        <Image
                          src={productImage(line.product)}
                          alt=""
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug text-ink">
                          {line.product.name}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          Size {line.size ?? "to confirm"}
                          {line.colour ? ` · ${line.colour}` : ""}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-accent">
                          {formatPrice(line.product)}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-silver-500/40">
                            <button
                              type="button"
                              onClick={() => setQty(index, line.qty - 1)}
                              aria-label={`One less ${line.product.name}`}
                              className="flex size-9 items-center justify-center text-ink"
                            >
                              <MinusIcon width={14} height={14} />
                            </button>
                            <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(index, line.qty + 1)}
                              aria-label={`One more ${line.product.name}`}
                              className="flex size-9 items-center justify-center text-ink"
                            >
                              <PlusIcon width={14} height={14} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => setQty(index, 0)}
                            className="text-sm text-muted underline underline-offset-4 hover:text-ink"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="shrink-0 border-t border-silver-500/20 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                  <p className="text-sm text-muted">
                    Nothing is charged here. We confirm stock, size and the
                    total on WhatsApp, and you pay on delivery.
                  </p>
                  <a
                    href={waLink(bagMessage(lines.map(({ line }) => line)))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa mt-4 w-full"
                  >
                    <WhatsAppIcon width={18} height={18} />
                    Order all on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={clearBag}
                    className="mt-3 w-full py-2 text-sm text-muted underline underline-offset-4 hover:text-ink"
                  >
                    Empty bag
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
