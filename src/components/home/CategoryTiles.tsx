import Image from "next/image";
import Link from "next/link";
import { categories, categoryImage } from "@/data/products";
import { ArrowRightIcon } from "@/components/ui/Icons";

/** Two tall tiles. Slow zoom on the photograph, silver border draws in on hover. */
export function CategoryTiles() {
  return (
    <section className="section-y bg-bone" aria-labelledby="collections-heading">
      <div className="shell">
        <div
          data-reveal="up"
          className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <p className="label text-muted">The collections</p>
            <h2
              id="collections-heading"
              data-reveal="sheen"
              data-lines
              className="t-head type-silver mt-5"
            >
              Three collections, kept tight.
            </h2>
          </div>
          <p className="t-body max-w-sm text-neutral-600">
            We only make and stock what we can sell you properly. That is why
            there are three collections and not forty.
          </p>
        </div>

        <div
          data-reveal="up"
          data-reveal-stagger
          className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2 md:gap-6 lg:grid-cols-3"
        >
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              className="draw-border group relative block overflow-hidden"
            >
              <div
                data-reveal="clip"
                className="media-frame aspect-[5/7] md:aspect-[4/5]"
              >
                <span className="skeleton" aria-hidden="true" />
                <Image
                  src={categoryImage(category)}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 46vw, 92vw"
                  className="zoom-slow object-cover"
                />
                {/* Heavier than the hero scrim, and deliberately shaped. A tile
                    is a small crop of an arbitrary photograph, and the kurta
                    tile is a pale pink garment against pale wood — at the old
                    0.55-0.62 the frost white heading and the body copy
                    vanished into it. So the bottom 40% is nearly opaque, where
                    all the text lives, and it only lifts toward the top of the
                    frame where the photograph is meant to be seen. */}
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.96)_0%,rgba(10,10,10,0.93)_40%,rgba(10,10,10,0.58)_74%,rgba(10,10,10,0.38)_100%)]" />
                {/* Frosted plate behind the caption block. See .scrim-blur. */}
                <div className="scrim-blur" aria-hidden="true" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-9">
                <div>
                  <p className="label text-silver-100">
                    {category.lookbookCaption}
                  </p>
                  <h3 className="t-display type-silver-dark mt-4">
                    {category.name}
                  </h3>
                  <p className="t-body mt-3 max-w-sm text-neutral-300">
                    {category.description}
                  </p>
                  <span className="label mt-7 inline-flex items-center gap-3 text-bone">
                    Explore
                    <ArrowRightIcon
                      width={16}
                      height={16}
                      className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5"
                    />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}