import catalogue from "@/data/products.json";
import { CROP, photo } from "@/lib/images";

/* ------------------------------------------------------------------ types */

export interface Colour {
  name: string;
  hex: string;
}

export interface ProductImage {
  seed: string;
  alt: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  fabric: string;
  fabricNote: string;
  description: string;
  details: string[];
  care: string;
  sizes: string[];
  colours: Colour[];
  images: ProductImage[];
  featured: boolean;
  isNew: boolean;
  addedAt: string;
}

export interface Category {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  bannerLine: string;
  imageSeed: string;
  imageAlt: string;
  lookbookCaption: string;
  blurb: string;
}

/* ----------------------------------------------------------------- source */

export const categories: Category[] = catalogue.categories;
export const products: Product[] = catalogue.products;

const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
const productBySlug = new Map(products.map((p) => [p.slug, p]));

/* -------------------------------------------------------------- accessors */

export function getCategory(slug: string): Category | undefined {
  return categoryBySlug.get(slug);
}

export function getProduct(slug: string): Product | undefined {
  return productBySlug.get(slug);
}

export function categoryName(slug: string): string {
  return categoryBySlug.get(slug)?.name ?? slug;
}

/** Resolved image URLs for a product, using the fixed product crop. */
export function productImages(product: Product): string[] {
  return product.images.map((img) => photo(img.seed, CROP.product.w, CROP.product.h));
}

export function productImage(product: Product, index = 0): string {
  const img = product.images[index] ?? product.images[0];
  return photo(img.seed, CROP.product.w, CROP.product.h);
}

/** Higher resolution crop for the product page gallery. */
export function galleryImages(product: Product): string[] {
  return product.images.map((img) => photo(img.seed, CROP.gallery.w, CROP.gallery.h));
}

export function categoryImage(category: Category): string {
  return photo(category.imageSeed, CROP.tile.w, CROP.tile.h);
}

/* ------------------------------------------------------------ collections */

export function productsByCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

/** The eight products in the home page "Picked for you" row. */
export function featuredProducts(limit = 8): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

/**
 * Items from the other collections.
 *
 * Round-robins across every category except the one being viewed, rather than
 * taking the first match. That mattered as soon as there were three: picking a
 * single "other" category made one collection permanently invisible on the
 * pages of whichever collection happened to sort after it.
 */
export function completeTheLook(currentSlug: string, limit = 4): Product[] {
  const queues = categories
    .filter((c) => c.slug !== currentSlug)
    .map((c) => productsByCategory(c.slug));

  const out: Product[] = [];
  while (out.length < limit && queues.some((queue) => queue.length > 0)) {
    for (const queue of queues) {
      if (queue.length > 0 && out.length < limit) out.push(queue.shift()!);
    }
  }
  return out;
}

/** "You may also like" — same category first, topped up from the other. */
export function relatedProducts(product: Product, limit = 4): Product[] {
  const same = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  );
  const other = products.filter(
    (p) => p.category !== product.category && p.slug !== product.slug,
  );
  return [...same, ...other].slice(0, limit);
}

/** Case-insensitive match on product name, fabric and colour names. */
export function searchProducts(query: string, limit = 6): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products
    .map((p) => {
      const haystack = [p.name, p.fabric, ...p.colours.map((c) => c.name)].join(" ").toLowerCase();
      const inName = p.name.toLowerCase().includes(q);
      return { p, score: inName ? 0 : haystack.includes(q) ? 1 : 2 };
    })
    .filter((r) => r.score < 2)
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((r) => r.p);
}

/* --------------------------------------------------------------- filtering */

export interface FilterOptions {
  sizes: string[];
  colours: string[];
  fabrics: string[];
}

/** Available filter values for one category, ordered for the pill bar. */
export function filterOptionsFor(slug: string): FilterOptions {
  const inCategory = productsByCategory(slug);

  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
  const sizes = [
    ...new Set(inCategory.flatMap((p) => p.sizes)),
  ].sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));

  const colours = [...new Set(inCategory.flatMap((p) => p.colours.map((c) => c.name)))];
  const fabrics = [...new Set(inCategory.map((p) => p.fabric))].sort();

  return { sizes, colours, fabrics };
}

export type SortOption = "newest" | "featured";

export const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest",
  featured: "Featured",
};

export interface ActiveFilters {
  sizes: string[];
  colours: string[];
  fabrics: string[];
}

export const emptyFilters: ActiveFilters = { sizes: [], colours: [], fabrics: [] };

/** Filter and sort in memory. No reload, no request. */
export function applyFilters(
  list: Product[],
  filters: ActiveFilters,
  sort: SortOption,
): Product[] {
  const filtered = list.filter((p) => {
    const sizeOk =
      filters.sizes.length === 0 || filters.sizes.some((s) => p.sizes.includes(s));
    const colourOk =
      filters.colours.length === 0 ||
      filters.colours.some((c) => p.colours.some((pc) => pc.name === c));
    const fabricOk =
      filters.fabrics.length === 0 || filters.fabrics.includes(p.fabric);
    return sizeOk && colourOk && fabricOk;
  });

  if (sort === "newest") {
    return [...filtered].sort((a, b) => b.addedAt.localeCompare(a.addedAt));
  }

  /* Default order: promoted pieces first, then newest, then alphabetical.
     Uses the featured and addedAt fields that are already in the data, so
     merchandising needs no schema change. The name tiebreak keeps the result
     stable when two pieces share an addedAt date. */
  return [...filtered].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.addedAt !== b.addedAt) return b.addedAt.localeCompare(a.addedAt);
    return a.name.localeCompare(b.name);
  });
}

export function countActiveFilters(filters: ActiveFilters): number {
  return filters.sizes.length + filters.colours.length + filters.fabrics.length;
}