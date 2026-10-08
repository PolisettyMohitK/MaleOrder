"use client";

import type { SortOption } from "@/data/products";
import { SORT_LABELS } from "@/data/products";
import { FilterDropdown, type FilterOption } from "./FilterDropdown";

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

/**
 * Filter and sort bar. Everything happens in memory on the client, so the
 * grid responds instantly with no navigation and no request.
 *
 * The four groups were inline pills, listing every value on the page — which
 * across Size, Colour and Fabric pushed the actual grid well below the fold
 * without a single filter being applied. They are now collapsed triggers that
 * open a panel, styled to match the floating menu, which keeps the grid close
 * to where you landed and still shows how many filters are live.
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
  const activeCount = groups.reduce(
    (total, group) => total + active[group.key].length,
    0,
  );

  const sortOptions = (Object.keys(SORT_LABELS) as SortOption[]).map((option) => ({
    value: option,
    label: SORT_LABELS[option],
  }));

  return (
    <div className="border-y border-silver-500/20 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label text-muted" aria-live="polite">
          {resultCount === totalCount
            ? `${totalCount} pieces`
            : `${resultCount} of ${totalCount} pieces`}
        </p>

        <FilterDropdown
          label="Sort"
          single
          prefix={null}
          options={sortOptions}
          selected={[sort]}
          onToggle={(value) => onSort(value as SortOption)}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-start gap-3">
        {groups.map((group) => (
          <FilterDropdown
            key={group.key}
            label={group.label}
            options={group.values.map<FilterOption>((value) => ({
              value,
              label: value,
              hex: group.key === "colours" ? swatches[value] : undefined,
            }))}
            selected={active[group.key]}
            onToggle={(value) => onToggle(group.key, value)}
          />
        ))}

        {anyActive ? (
          <button
            type="button"
            onClick={onClear}
            className="tap label link-draw px-4 py-2.5 text-ink"
          >
            Clear all filters ({activeCount})
          </button>
        ) : null}
      </div>
    </div>
  );
}