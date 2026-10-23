import Image from "next/image";
import Link from "next/link";
import { categories, categoryImage, productsByCategory } from "@/data/products";
import { ArrowRightIcon } from "@/components/ui/Icons";

/** Two category tiles: photo, name, piece count, and a Shop button. */
export function CategoryTiles() {
  return (
    <section className="bg-bone py-14 md:py-20" aria-labelledby="collections-heading">
      <div className="shell">
        <div data-reveal="up">
          <p className="eyebrow">Categories</p>
          <h2 id="collections-heading" className="t-head type-silver mt-3">
            Shop by category
          </h2>
        </div>

        <div
          data-reveal="up"
          data-reveal-stagger
          className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:gap-6"
        >
          {categories.map((category) => {
            const count = productsByCategory(category.slug).length;
            return (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className="group relative block overflow-hidden rounded-sm"
              >
                <div className="media-frame aspect-[3/4] md:aspect-[4/5]">
                  <span className="skeleton" aria-hidden="true" />
                  <Image
                    src={categoryImage(category)}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 46vw, 48vw"
                    className="zoom-slow object-cover"
                  />
                  {/* Dark only at the bottom, where the text sits. */}
                  <div className="absolute inset-0 z-[2] bg-[linear-gradient(to_top,rgba(26,26,26,0.85)_0%,rgba(26,26,26,0.35)_38%,transparent_60%)]" />
                </div>

                <div className="absolute inset-x-0 bottom-0 z-[3] p-4 md:p-8">
                  <h3 className="font-display text-2xl leading-tight font-medium text-paper md:text-4xl">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-paper/85">
                    {count} {count === 1 ? "piece" : "pieces"}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink transition-colors duration-500 group-hover:bg-bone">
                    Shop
                    <ArrowRightIcon
                      width={15}
                      height={15}
                      className="transition-transform duration-500 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
