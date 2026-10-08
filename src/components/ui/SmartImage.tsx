import Image from "next/image";

interface SmartImageProps {
  src: string;
  alt: string;
  /** CSS aspect ratio utility, e.g. "aspect-[3/4]". */
  ratio?: string;
  /** Required for responsive remote images. */
  sizes: string;
  /** Preload instead of lazy-loading. Use only for above-the-fold images. */
  preload?: boolean;
  className?: string;
  imgClassName?: string;
}

/**
 * Every image on the site goes through here, which gives us the grey loading
 * state for free: the shimmer sits behind the <img>, so it is covered the
 * moment the photograph arrives. No JavaScript involved.
 *
 * Photographs render in their own colour. They used to pass through a
 * `grayscale(1)` filter, which made a set of unrelated placeholder images read
 * as one deliberate series. Now that the catalogue has real, coherent
 * photography, desaturating it only threw the colour away.
 */
export function SmartImage({
  src,
  alt,
  ratio = "aspect-[3/4]",
  sizes,
  preload = false,
  className = "",
  imgClassName = "",
}: SmartImageProps) {
  return (
    <div className={`media-frame ${ratio} ${className}`}>
      <span className="skeleton" aria-hidden="true" />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={`object-cover ${imgClassName}`}
      />
    </div>
  );
}