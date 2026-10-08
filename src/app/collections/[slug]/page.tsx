import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CollectionBrowser } from "@/components/product/CollectionBrowser";
import { ProductRail } from "@/components/product/ProductRail";
import {
  categories,
  completeTheLook,
  getCategory,
  productsByCategory,
} from "@/data/products";

/** Both collection pages are known at build time. */
export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(
  props: PageProps<"/collections/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = getCategory(slug);
  if (!category) return { title: "Collection not found" };

  return {
    title: category.name,
    description: `${category.bannerLine} ${category.blurb}`,
    openGraph: { title: category.name, description: category.description },
  };
}

export default async function CollectionPage(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;
  const category = getCategory(slug);

  if (!category) notFound();

  const products = productsByCategory(slug);
  const suggestions = completeTheLook(slug, 4);

  return (
    <PageTransition>
    <div className="pt-[100px] md:pt-[108px]">
      {/* Slim banner */}
      <section className="bg-bone" aria-labelledby="collection-heading">
        <div className="shell pt-16 pb-14 md:pt-24 md:pb-20">
          <nav aria-label="Breadcrumb" className="label text-muted">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true" className="px-2">
              /
            </span>
            <span className="text-ink">{category.name}</span>
          </nav>

          <div data-reveal="up">
            <h1
              id="collection-heading"
              data-reveal="sheen"
              data-lines
              className="t-display type-silver mt-8 max-w-4xl"
            >
              {category.name}
            </h1>
            <p className="t-body mt-6 max-w-xl text-neutral-600">
              {category.bannerLine}
            </p>
          </div>

          <div data-reveal="up">
            <p className="t-body mt-8 max-w-2xl border-t border-silver-500/20 pt-8 text-neutral-600">
              {category.blurb}
            </p>
          </div>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="bg-paper pb-24 md:pb-32" aria-labelledby="pieces-heading">
        <div className="shell">
          <div className="pt-12 md:pt-16">
            <h2 id="pieces-heading" className="sr-only">
              {category.name} — all pieces
            </h2>
            <CollectionBrowser products={products} currentSlug={slug} />
          </div>
        </div>
      </section>

      {/* Complete the look */}
      <section className="on-dark section-y overflow-hidden bg-ink" aria-labelledby="complete-heading">
        <div className="sr-only" id="complete-heading">
          Complete the look
        </div>
        <ProductRail
          products={suggestions}
          eyebrow="Complete the look"
          title="The rest of the rail"
          tone="dark"
        />
      </section>
      </div>
    </PageTransition>
  );
}
