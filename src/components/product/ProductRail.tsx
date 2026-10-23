import Link from "next/link";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { ArrowRightIcon } from "@/components/ui/Icons";

interface ProductRailProps {
  products: Product[];
  eyebrow: string;
  title: string;
  /** Optional link shown at the right of the heading. */
  link?: { href: string; label: string };
  tone?: "light" | "dark";
}

/**
 * Heading plus a small grid of product cards. Used for the "You may also
 * like" strips on collection and product pages.
 */
export function ProductRail({
  products,
  eyebrow,
  title,
  link,
  tone = "light",
}: ProductRailProps) {
  const dark = tone === "dark";

  return (
    <div>
      <div className="shell">
        <div data-reveal="up" className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2
              data-reveal="sheen"
              className={`t-head mt-3 ${dark ? "type-silver-dark" : "type-silver"}`}
            >
              {title}
            </h2>
          </div>
            {link ? (
              <Link
                href={link.href}
                className={`label link-draw inline-flex items-center gap-2 ${
                  dark ? "text-bone" : "text-ink"
                }`}
              >
                {link.label}
                <ArrowRightIcon width={15} height={15} />
              </Link>
            ) : null}
        </div>
      </div>

      {/* A grid, not a swipe rail. The rail snapped cards flush against the
          screen edge on phones; four pieces sit evenly in two columns. */}
      <ul
        data-reveal="up"
        data-reveal-stagger
        className="shell mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-10 md:gap-x-6 lg:grid-cols-4"
      >
        {products.map((product) => (
          <li key={product.slug}>
            <ProductCard
              product={product}
              tone={tone}
              sizes="(min-width: 1024px) 22vw, 46vw"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}