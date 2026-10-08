import Image from "next/image";
import Link from "next/link";
import { categoryName, featuredProducts, productImage } from "@/data/products";

/**
 * Uneven, magazine-style grid. Column spans and aspect ratios are declared
 * per tile so the page reads like a lookbook rather than a product table.
 */
const LAYOUT = [
  { span: "col-span-6 lg:col-span-5", ratio: "aspect-[3/4]", offset: "" },
  { span: "col-span-6 lg:col-span-7", ratio: "aspect-[4/3] lg:aspect-[16/10]", offset: "lg:mt-16" },
  { span: "col-span-6 lg:col-span-4", ratio: "aspect-[3/4]", offset: "lg:mt-6" },
  { span: "col-span-6 lg:col-span-3", ratio: "aspect-[3/4]", offset: "lg:mt-20" },
  { span: "col-span-6 lg:col-span-5", ratio: "aspect-[4/3]", offset: "lg:-mt-10" },
  { span: "col-span-12 lg:col-span-7", ratio: "aspect-[16/10]", offset: "" },
  { span: "col-span-12 lg:col-span-5", ratio: "aspect-[3/4]", offset: "lg:-mt-24" },
];

export function LookbookGrid() {
  const pieces = featuredProducts(7);

  return (
    <section className="section-y bg-paper" aria-labelledby="lookbook-heading">
      <div className="shell">
        <div data-reveal="up">
          <p className="label text-muted">Lookbook</p>
          <h2
            id="lookbook-heading"
            data-reveal="sheen"
            data-lines
            className="t-head type-silver mt-5"
          >
            This season, in the order we would wear it.
          </h2>
        </div>

        <ul className="mt-14 grid grid-cols-12 gap-x-5 gap-y-12 md:mt-20 md:gap-x-6 lg:gap-y-0">
          {pieces.map((product, index) => {
            const tile = LAYOUT[index % LAYOUT.length];

            return (
              <li key={product.slug} className={`${tile.span} ${tile.offset}`}>
                <div data-reveal="up">
                  <Link href={`/products/${product.slug}`} className="group block">
                    <div data-reveal="clip" className={`media-frame ${tile.ratio}`}>
                      <span className="skeleton" aria-hidden="true" />
                      <Image
                        src={productImage(product)}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 42vw, (min-width: 768px) 48vw, 92vw"
                        className="zoom-slow object-cover"
                      />
                    </div>
                    <div className="mt-3 flex items-baseline justify-between gap-3">
                      <p className="label text-muted">
                        {String(index + 1).padStart(2, "0")} —{" "}
                        {categoryName(product.category)}
                      </p>
                      <p className="truncate text-xs text-neutral-600 transition-colors duration-500 group-hover:text-ink">
                        {product.name}
                      </p>
                    </div>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}