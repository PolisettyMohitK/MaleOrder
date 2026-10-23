"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

import {
  applyFilters,
  emptyFilters,
  filterOptionsFor,
  type ActiveFilters,
  type Product,
  type SortOption,
} from "@/data/products";
import { ProductCard } from "./ProductCard";
import { FilterBar } from "./FilterBar";

const GROUP_LABELS: Record<keyof ActiveFilters, string> = {
  sizes: "Size",
  colours: "Colour",
  fabrics: "Fabric",
};

/** At or below this many pieces, the filter dropdowns are hidden. */
const FILTER_THRESHOLD = 6;

export function CollectionBrowser({
  products,
  currentSlug,
}: {
  products: Product[];
  currentSlug: string;
}) {
  const reduce = useReducedMotion();
  const [filters, setFilters] = useState<ActiveFilters>(emptyFilters);
  const [sort, setSort] = useState<SortOption>("featured");

  const options = useMemo(() => filterOptionsFor(currentSlug), [currentSlug]);

  /* Filters only earn their space once there is something to narrow down.
     A handful of pieces fits on one screen, so it gets the count and sort. */
  const groups = useMemo(
    () =>
      products.length <= FILTER_THRESHOLD
        ? []
        : (Object.keys(GROUP_LABELS) as (keyof ActiveFilters)[]).map((key) => ({
            key,
            label: GROUP_LABELS[key],
            values: options[key],
          })),
    [options, products.length],
  );

  // Colour name to hex, so a colour filter shows the colour it filters on.
  const swatches = useMemo(() => {
    const map: Record<string, string> = {};
    for (const product of products) {
      for (const colour of product.colours) {
        map[colour.name] ??= colour.hex;
      }
    }
    return map;
  }, [products]);

const visible = useMemo(
    () => applyFilters(products, filters, sort),
    [products, filters, sort],
  );

  function toggle(key: keyof ActiveFilters, value: string) {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((v) => v !== value)
        : [...current[key], value],
    }));
  }

  return (
    <>
      <FilterBar
        groups={groups}
        active={filters}
        swatches={swatches}
        sort={sort}
        resultCount={visible.length}
        totalCount={products.length}
        onToggle={toggle}
        onSort={setSort}
        onClear={() => setFilters(emptyFilters)}
      />

      {visible.length === 0 ? (
        <div className="py-24 text-center">
          <p className="t-head shine">Nothing matches those filters.</p>
          <p className="t-body mx-auto mt-4 max-w-sm text-neutral-600">
            Try removing a size or colour — or message us on WhatsApp and we
            will tell you what came in this week.
          </p>
          <button
            type="button"
            onClick={() => setFilters(emptyFilters)}
            className="btn btn-ink mt-8"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-8 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((product, index) => (
              <motion.li
                key={product.slug}
                layout={!reduce}
                initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -10 }}
                transition={{
                  duration: 0.45,
                  delay: reduce ? 0 : Math.min(index * 0.03, 0.24),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ProductCard
                  product={product}
                  preload={index < 4}
                  sizes="(min-width: 1024px) 22vw, (min-width: 768px) 31vw, 46vw"
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </>
  );
}