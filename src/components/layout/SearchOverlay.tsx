"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories, productImage, searchProducts } from "@/data/products";
import type { Product } from "@/data/products";
import { lockScroll } from "@/lib/scroll";
import { surfaceSpring, surfaceStagger, withReduce } from "@/components/motion/surface";
import { CloseIcon, SearchIcon } from "@/components/ui/Icons";

const SUGGESTED = categories.map((c) => c.name);

/**
 * The overlay is only mounted while it is open (see Header), so the query and
 * the cursor always start fresh — no reset effect needed.
 */
export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const results: Product[] = useMemo(() => searchProducts(query), [query]);

  const suggestions = useMemo(() => (query.trim() ? [] : SUGGESTED), [query]);

  const listLength = query.trim() ? results.length : suggestions.length;

  useEffect(() => {
    lockScroll(true);
    const id = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => {
      window.clearTimeout(id);
      lockScroll(false);
    };
  }, []);

  function go(path: string) {
    onClose();
    router.push(path);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((c) => Math.min(c + 1, Math.max(0, listLength - 1)));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
      return;
    }
    if (event.key !== "Enter") return;

    const target = query.trim()
      ? results[cursor] ?? results[0]
      : null;

    if (target) {
      go(`/products/${target.slug}`);
      return;
    }
    const named = categories.find(
      (c) => c.name.toLowerCase() === query.trim().toLowerCase(),
    );
    if (named) {
      go(`/collections/${named.slug}`);
      return;
    }
    if (query.trim()) {
      go(`/collections/${categories[0].slug}`);
    }
  }

  return (
    /* Same vocabulary as the floating menu: scrim fades, the panel springs
       up from its top edge, then the contents stagger in. */
    <motion.div
      className="on-dark fixed inset-0 z-[90] flex flex-col origin-top bg-ink"
      initial={{ opacity: 0, scale: reduce ? 1 : 0.985, y: reduce ? 0 : -14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: reduce ? 1 : 0.99, y: reduce ? 0 : -10 }}
      transition={withReduce(reduce, surfaceSpring)}
      role="dialog"
      aria-modal="true"
      aria-label="Search the collection"
    >
      <motion.div
        className="shell pt-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={withReduce(reduce, surfaceStagger(0, 0.035, 0.06))}
      >
        <div className="flex items-center justify-between">
          <span className="label text-silver-300">Search</span>
          <button
            type="button"
            onClick={onClose}
            className="label tap -mr-2 flex items-center gap-2 px-2 text-bone transition-colors duration-500 hover:text-silver-100"
          >
            Close
            <CloseIcon width={18} height={18} />
          </button>
        </div>

        <motion.div
          className="mt-6 flex items-center gap-4 border-b border-white/15 pb-5 md:mt-10"
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={withReduce(reduce, surfaceStagger(1, 0.035, 0.06))}
        >
          <SearchIcon width={22} height={22} className="shrink-0 text-silver-400" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Try “linen” or “kurta”"
            aria-label="Search products"
            className="w-full bg-transparent font-display text-2xl font-light tracking-tight text-bone outline-none placeholder:text-silver-300/70 md:text-4xl"
            autoComplete="off"
          />
        </motion.div>
      </motion.div>

      <div className="shell mt-8 flex-1 overflow-y-auto pb-10">
        {query.trim() && results.length === 0 ? (
          <p className="t-body max-w-md text-silver-400">
            Nothing matches “{query.trim()}”. Try a fabric like linen, or browse
            the collections below.
          </p>
        ) : null}

        {suggestions.length > 0 ? (
          <div>
            <p className="label text-silver-300">Browse</p>
            <ul className="mt-5 flex flex-col gap-1">
              {suggestions.map((name) => {
                const category = categories.find((c) => c.name === name)!;
                return (
                  <li key={name}>
                    <Link
                      href={`/collections/${category.slug}`}
                      onClick={onClose}
                      className="group flex items-baseline justify-between gap-4 border-b border-white/8 py-4 transition-colors duration-500 hover:border-silver-400"
                    >
                      <span className="t-head text-bone transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
                        {name}
                      </span>
                      <span className="label hidden text-silver-300 sm:block">
                        {category.description}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        {results.length > 0 ? (
          <div>
            <p className="label text-silver-300">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {results.map((product, index) => (
                <li key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={onClose}
                    onMouseEnter={() => setCursor(index)}
                    className={`group block transition-opacity duration-500 ${
                      cursor === index
                        ? "opacity-100"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="media-frame aspect-[3/4]">
                      <span className="skeleton" aria-hidden="true" />
                      <Image
                        src={productImage(product)}
                        alt={product.images[0].alt}
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                        className="media-moody object-cover"
                      />
                    </div>
                    <p className="mt-3 text-sm text-bone">{product.name}</p>
                    <p className="label mt-1 text-silver-300">{product.fabric}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="shell py-5">
        <p className="label text-silver-300">
          <span className="hidden sm:inline">Enter to open · Esc to close</span>
          <span className="sm:hidden">Tap a result to open it</span>
        </p>
      </div>
    </motion.div>
  );
}