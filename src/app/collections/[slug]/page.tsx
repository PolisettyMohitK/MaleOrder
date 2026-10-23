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
      {/* Compact banner, so the first pieces show on a phone's first screen. */}
      <section className="bg-paper" aria-labelledby="collection-heading">
        <div className="shell pt-6 pb-5 md:pt-10 md:pb-8">
          <nav aria-label="Breadcrumb" className="label text-muted">
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
            <span aria-hidden="true" className="px-2">
              /
            </span>
            <span className="text-ink">{category.name}</span>
          </nav>

          <h1 id="collection-heading" className="t-head type-silver mt-4">
            {category.name}
          </h1>
          <p className="t-body mt-2 max-w-xl text-muted">{category.bannerLine}</p>

          {/* Jump between categories without going back home. */}
          <nav aria-label="Categories" className="mt-5 flex flex-wrap gap-2">
            {categories.map((item) => {
              const current = item.slug === slug;
              return (
                <Link
                  key={item.slug}
                  href={`/collections/${item.slug}`}
                  aria-current={current ? "page" : undefined}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    current
                      ? "border-accent bg-accent text-paper"
                      : "border-silver-500/40 text-ink hover:border-ink"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Sort + grid */}
      <section className="bg-paper pb-14 md:pb-20" aria-labelledby="pieces-heading">
        <div className="shell">
          <h2 id="pieces-heading" className="sr-only">
            {category.name} — all pieces
          </h2>
          <CollectionBrowser products={products} currentSlug={slug} />

          <div className="mt-14 max-w-2xl border-t border-silver-500/20 pt-8">
            <h2 className="text-base font-semibold text-ink">About {category.name}</h2>
            <p className="t-body mt-2 text-muted">{category.blurb}</p>
          </div>
        </div>
      </section>

      {/* Complete the look */}
      <section className="overflow-hidden bg-bone py-14 md:py-20" aria-labelledby="complete-heading">
        <div className="sr-only" id="complete-heading">
          You may also like
        </div>
        <ProductRail
          products={suggestions}
          eyebrow="From the other collection"
          title="You may also like"
        />
      </section>
      </div>
    </PageTransition>
  );
}
