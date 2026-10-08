import Link from "next/link";
import { categories } from "@/data/products";
import { ArrowRightIcon } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <div className="on-dark flex min-h-dvh flex-col items-center justify-center bg-ink px-6 py-32 text-center">
      <p className="label text-silver-300">Error 404</p>
      <h1 className="t-display shine mt-7 max-w-2xl text-bone">
        This page has moved on.
      </h1>
      <p className="t-body mt-7 max-w-md text-neutral-300">
        The link you followed does not exist any more. Try one of the
        collections instead — there are only two of them.
      </p>

      <div className="mt-11 flex flex-col items-center gap-4 sm:flex-row">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/collections/${category.slug}`}
            className="btn btn-paper w-full sm:w-auto"
          >
            {category.name}
            <ArrowRightIcon width={15} height={15} />
          </Link>
        ))}
      </div>

      <Link href="/" className="label link-draw mt-12 text-bone">
        Back to home
      </Link>
    </div>
  );
}