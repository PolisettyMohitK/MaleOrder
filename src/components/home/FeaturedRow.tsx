import { featuredProducts } from "@/data/products";
import { ProductRail } from "@/components/product/ProductRail";

/** "Picked for you" on the home page — eight pieces, both categories. */
export function FeaturedRow() {
  return (
    <section className="section-y overflow-hidden bg-paper" aria-labelledby="featured-heading">
      <h2 id="featured-heading" className="sr-only">
        Picked for you
      </h2>
      <ProductRail
        products={featuredProducts(8)}
        eyebrow="Selected by us"
        title="Picked for you"
        link={{ href: "/collections/office-casuals", label: "View both collections" }}
      />
    </section>
  );
}