import Image from "next/image";
import Link from "next/link";
import { CROP } from "@/lib/images";
import { photo } from "@/lib/images";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  /** Responsive sizes hint, so the right crop is fetched. */
  sizes?: string;
  /** Preload instead of lazy-loading. First card in a grid only. */
  preload?: boolean;
  /** Caption above the name, used by the lookbook. */
  caption?: string;
  tone?: "light" | "dark";
}

const DEFAULT_SIZES =
  "(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 88vw";

/**
 * Product card. The whole hover treatment — lift, slow zoom, second angle
 * fading in — is CSS, so there is no JavaScript cost and it still works
 * before hydration.
 */
export function ProductCard({
  product,
  sizes = DEFAULT_SIZES,
  preload = false,
  caption,
  tone = "light",
}: ProductCardProps) {
  const primary = product.images[0];
  const secondary = product.images[1] ?? product.images[0];

  const muted = tone === "dark" ? "text-silver-300" : "text-muted";
  const name = tone === "dark" ? "text-bone" : "text-ink";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5"
    >
      <div className="media-frame aspect-[3/4]">
        <span className="skeleton" aria-hidden="true" />

        <Image
          src={photo(primary.seed, CROP.product.w, CROP.product.h)}
          alt={primary.alt}
          fill
          sizes={sizes}
          preload={preload}
          className="base-image media-moody zoom-slow object-cover"
        />

        {secondary.seed !== primary.seed ? (
          /* The second angle only makes sense where there is a pointer to
             hover with. Hiding it on small screens also stops the browser
             fetching it, which halves the images on a phone. */
          <Image
            src={photo(secondary.seed, CROP.product.w, CROP.product.h)}
            alt={secondary.alt}
            fill
            sizes={sizes}
            loading="lazy"
            aria-hidden="true"
            className="swap-image media-moody zoom-slow max-md:hidden object-cover"
          />
        ) : null}

        {product.isNew ? (
          <span
            className={`label absolute top-3 left-3 z-[2] border px-2.5 py-1.5 backdrop-blur-sm ${
              tone === "dark"
                ? "border-white/25 bg-ink/40 text-bone"
                : "border-black/10 bg-white/70 text-ink"
            }`}
          >
            New
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          {caption ? (
            <p className={`label ${muted}`}>{caption}</p>
          ) : null}
          <h3
            className={`mt-0.5 truncate text-sm font-normal tracking-[0.01em] transition-colors duration-500 group-hover:text-muted ${name}`}
          >
            {product.name}
          </h3>
        </div>
        <p className={`label shrink-0 text-right ${muted}`}>{product.fabric}</p>
      </div>
    </Link>
  );
}