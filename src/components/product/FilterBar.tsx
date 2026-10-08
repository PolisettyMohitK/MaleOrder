"use client";

import type { SortOption } from "@/data/products";
import { SORT_LABELS } from "@/data/products";

type GroupKey = "sizes" | "colours" | "fabrics";

interface FilterBarProps {
  groups: { key: GroupKey; label: string; values: string[] }[];
  active: Record<GroupKey, string[]>;
  /** Colour name to hex, taken from the catalogue so it stays single-sourced. */
  swatches: Record<string, string>;
  sort: SortOption;
  resultCount: number;
  totalCount: number;
  onToggle: (group: GroupKey, value: string) => void;
  onSort: (sort: SortOption) => void;
  onClear: () => void;
}

const PILL =
  "tap inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs tracking-[0.08em] transition-colors duration-500";

/**
 * Filter and sort bar. Everything happens in memory on the client, so the
 * grid responds instantly with no navigation and no request.
 */
export function FilterBar({
  groups,
  active,
  swatches,
  sort,
  resultCount,
  totalCount,
  onToggle,
  onSort,
  onClear,
}: FilterBarProps) {
  const anyActive = groups.some((group) => active[group.key].length > 0);

  return (
    <div className="border-y border-silver-500/20 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label text-muted" aria-live="polite">
          {resultCount === totalCount
            ? `${totalCount} pieces`
            : `${resultCount} of ${totalCount} pieces`}
        </p>

        <div className="flex items-center gap-3">
          <span className="label text-muted">Sort</span>
          <div
            role="group"
            aria-label="Sort products"
            className="flex items-center gap-1 rounded-full border border-silver-500/35 p-1"
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => {
              const selected = sort === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSort(option)}
                  aria-pressed={selected}
                  className={`tap rounded-full px-4 py-1.5 text-xs tracking-[0.08em] transition-colors duration-500 ${
                    selected ? "bg-ink text-paper" : "text-neutral-600 hover:text-ink"
                  }`}
                >
                  {SORT_LABELS[option]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {groups.map((group) => (
          <div
            key={group.key}
            className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6"
          >
            <p className="label w-20 shrink-0 pt-3 text-muted">{group.label}</p>
            <ul className="flex flex-wrap gap-2">
              {group.values.map((value) => {
                const selected = active[group.key].includes(value);
                const hex = group.key === "colours" ? swatches[value] : undefined;

                return (
                  <li key={value}>
                    <button
                      type="button"
                      onClick={() => onToggle(group.key, value)}
                      aria-pressed={selected}
                      className={`${PILL} ${
                        selected
                          ? "border-ink bg-ink text-paper"
                          : "border-silver-500/40 text-neutral-600 hover:border-ink hover:text-ink"
                      }`}
                    >
                      {hex ? (
                        <span
                          aria-hidden="true"
                          className={`size-3 shrink-0 rounded-full border ${
                            selected ? "border-paper/40" : "border-black/15"
                          }`}
                          style={{ backgroundColor: hex }}
                        />
                      ) : null}
                      {value}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {anyActive ? (
        <button type="button" onClick={onClear} className="label link-draw mt-6 text-ink">
          Clear all filters
        </button>
      ) : null}
    </div>
  );
}