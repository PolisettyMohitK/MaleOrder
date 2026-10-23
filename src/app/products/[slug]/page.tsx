import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Gallery } from "@/components/product/Gallery";
import { ProductOrderPanel } from "@/components/product/ProductOrderPanel";
import { ProductRail } from "@/components/product/ProductRail";
import {
  categoryName,
  formatPrice,
  galleryImages,
  getProduct,
  products,
  relatedProducts,
} from "@/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: `${product.fabric}. ${product.description}`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: galleryImages(product)[0], alt: product.images[0].alt }],
    },
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);

  if (!product) notFound();

  const images = galleryImages(product).map((src, index) => ({
    src,
    alt: product.images[index]?.alt ?? product.name,
  }));

  const related = relatedProducts(product, 4);
  const collection = `/collections/${product.category}`;

  return (
    <PageTransition>
    <div className="pt-[100px] md:pt-[108px]">
      <div className="shell pt-5 md:pt-10">
        {/* Breadcrumb. The product name is the h1 just below, so phones skip
            it here and the trail stays on one line. */}
        <nav aria-label="Breadcrumb" className="label text-muted">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span aria-hidden="true" className="px-2">
            /
          </span>
          <Link href={collection} className="hover:text-ink">
            {categoryName(product.category)}
          </Link>
          <span aria-hidden="true" className="hidden px-2 sm:inline">
            /
          </span>
          <span className="hidden text-ink sm:inline">{product.name}</span>
        </nav>

        <div className="mt-5 grid gap-8 md:mt-8 lg:grid-cols-12 lg:gap-16">
          {/* Gallery */}
          {/* Sticky too, so the left column is not left empty while the
              longer details column scrolls past it. */}
          <div className="min-w-0 lg:col-span-7">
            <div className="lg:sticky lg:top-32">
              <Gallery images={images} name={product.name} />
            </div>
          </div>

          {/* Details + order */}
          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div data-reveal="up">
                <p className="eyebrow">
                  {categoryName(product.category)}
                  {product.isNew ? " · New" : ""}
                </p>
                <h1 className="t-head type-silver mt-2">{product.name}</h1>
                <p className="mt-3 text-xl font-semibold text-accent">{formatPrice(product)}</p>
                <p className="mt-1 text-sm text-muted">{product.fabric}</p>
                <p className="t-body mt-5 max-w-lg text-muted">
                  {product.description}
                </p>
              </div>

              <div data-reveal="up">
                <div className="mt-7">
                  <ProductOrderPanel product={product} />
                </div>
              </div>

              {/* Fabric, details, care */}
              <div data-reveal="up">
                <div className="mt-10 border-t border-silver-500/20 pt-6">
                  <h2 className="text-base font-semibold text-ink">Fabric</h2>
                  <p className="t-body mt-2 text-muted">{product.fabricNote}</p>
                </div>

                <div className="mt-6 border-t border-silver-500/20 pt-6">
                  <h2 className="text-base font-semibold text-ink">Details</h2>
                  <ul className="mt-3 flex flex-col gap-2">
                    {product.details.map((detail) => (
                      <li
                        key={detail}
                        className="t-body flex gap-3 text-muted"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
                        />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-silver-500/20 pt-6">
                  <h2 className="text-base font-semibold text-ink">Care</h2>
                  <p className="t-body mt-2 text-muted">{product.care}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You may also like */}
      <section className="mt-16 overflow-hidden bg-bone py-14 md:mt-24 md:py-20">
        <h2 id="also-like" className="sr-only">
          You may also like
        </h2>
        <ProductRail
          products={related}
          eyebrow="More to see"
          title="You may also like"
          link={{ href: collection, label: `All ${categoryName(product.category)}` }}
        />
      </section>
      {/* Room for the pinned order bar on phones, so it never covers content. */}
      <div aria-hidden="true" className="h-20 lg:hidden" />
      </div>
    </PageTransition>
  );
}
