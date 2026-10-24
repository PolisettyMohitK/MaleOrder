import Link from "next/link";
import { BAG_NOTE, categories, products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

/** Every piece on the home page, as a plain grid. "Shop now" lands here. */
export function FeaturedRow() {
  return (
    <section
      id="shop"
      className="scroll-mt-28 bg-paper py-14 md:py-20"
      aria-labelledby="shop-heading"
    >
      <div className="shell">
        <div data-reveal="up" className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">New this season</p>
            <h2 id="shop-heading" className="t-head type-silver mt-3">
              All pieces
            </h2>
            <p className="t-body mt-2 max-w-xl text-muted">{BAG_NOTE}</p>
          </div>
          <nav aria-label="Shop by category" className="flex flex-wrap gap-2">
            <span className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper">
              All ({products.length})
            </span>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className="rounded-full border border-silver-500/40 px-4 py-2 text-sm font-medium text-ink transition-colors duration-300 hover:border-ink"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-10 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
          {products.map((product, index) => (
            <li key={product.slug}>
              <ProductCard
                product={product}
                preload={index < 2}
                sizes="(min-width: 1024px) 22vw, (min-width: 768px) 31vw, 48vw"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
