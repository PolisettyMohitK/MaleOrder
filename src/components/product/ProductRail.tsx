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
 * Horizontal, swipeable rail of product cards. Used for the home page
 * "Picked for you" row and the "Complete the look" strip.
 */
export function ProductRail({
  products,
  eyebrow,
  title,
  link,
  tone = "light",
}: ProductRailProps) {
  const dark = tone === "dark";
  const eyebrowTone = dark ? "text-silver-400" : "text-muted";

  return (
    <div>
      <div className="shell">
        <div data-reveal="up" className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className={`label ${eyebrowTone}`}>{eyebrow}</p>
            <h2
              data-reveal="sheen"
              className={`t-head mt-5 ${dark ? "type-silver-dark" : "type-silver"}`}
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

      <ul
        data-reveal="up"
        data-reveal-stagger
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:mt-16 md:gap-6 md:px-10 lg:px-14 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, index) => (
          <li
            key={product.slug}
            className="w-[74vw] shrink-0 snap-start sm:w-[46vw] lg:w-[calc((100%-2.5rem*3)/4)]"
          >
            <ProductCard
              product={product}
              tone={tone}
              preload={index < 2}
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 46vw, 74vw"
            />
          </li>
        ))}
        {/* Balances the rail padding on wide screens. */}
        <li aria-hidden="true" className="hidden shrink-0 lg:block lg:w-0" />
      </ul>
    </div>
  );
}