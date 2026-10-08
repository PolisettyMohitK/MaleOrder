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
  /** Apply the desaturated editorial treatment. */
  moody?: boolean;
  className?: string;
  imgClassName?: string;
}

/**
 * Every image on the site goes through here, which is what keeps the
 * photography consistent and gives us the grey loading state for free:
 * the shimmer sits behind the <img>, so it is covered the moment the
 * photograph arrives. No JavaScript involved.
 */
export function SmartImage({
  src,
  alt,
  ratio = "aspect-[3/4]",
  sizes,
  preload = false,
  moody = true,
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
        className={`object-cover ${moody ? "media-moody" : ""} ${imgClassName}`}
      />
    </div>
  );
}