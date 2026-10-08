import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Gallery } from "@/components/product/Gallery";
import { ProductOrderPanel } from "@/components/product/ProductOrderPanel";
import { ProductRail } from "@/components/product/ProductRail";
import {
  categoryName,
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
      <div className="shell pt-10 md:pt-14">
        {/* Breadcrumb */}
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
          <span aria-hidden="true" className="px-2">
            /
          </span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <Gallery images={images} name={product.name} />
          </div>

          {/* Details + order */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div data-reveal="up">
                <p className="label text-muted">
                  {categoryName(product.category)}
                  {product.isNew ? " · New in" : ""}
                </p>
                <h1 className="t-head shine mt-5">{product.name}</h1>
                <p className="label mt-5 text-muted">{product.fabric}</p>
                <p className="t-body mt-6 max-w-lg text-neutral-600">
                  {product.description}
                </p>
              </div>

              <div data-reveal="up">
                <div className="mt-9">
                  <ProductOrderPanel product={product} />
                </div>
              </div>

              {/* Fabric, details, care */}
              <div data-reveal="up">
                <div className="mt-12 border-t border-silver-500/20 pt-8">
                  <h2 className="label text-muted">Fabric</h2>
                  <p className="t-body mt-3 text-neutral-600">{product.fabricNote}</p>
                </div>

                <div className="mt-8 border-t border-silver-500/20 pt-8">
                  <h2 className="label text-muted">Details</h2>
                  <ul className="mt-4 flex flex-col gap-3">
                    {product.details.map((detail) => (
                      <li
                        key={detail}
                        className="t-body flex gap-3 text-neutral-600"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2.5 size-1 shrink-0 rounded-full bg-silver-400"
                        />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 border-t border-silver-500/20 pt-8">
                  <h2 className="label text-muted">Care</h2>
                  <p className="t-body mt-3 text-neutral-600">{product.care}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You may also like */}
      <section className="on-dark mt-24 overflow-hidden bg-ink py-20 md:mt-32 md:py-28">
        <h2 id="also-like" className="sr-only">
          You may also like
        </h2>
        <ProductRail
          products={related}
          eyebrow="You may also like"
          title="Goes well with this"
          tone="dark"
          link={{ href: collection, label: `More ${categoryName(product.category)}` }}
        />
      </section>
      </div>
    </PageTransition>
  );
}
