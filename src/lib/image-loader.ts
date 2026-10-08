import type { ImageLoaderProps } from "next/image";

/**
 * Custom image loader for the static export.
 *
 * There is no image-optimisation server behind a static host, so `next/image`
 * cannot resize anything on the fly. Instead, scripts/generate-image-variants.mjs
 * pre-renders a set of widths at build time, and this loader simply points at
 * whichever one matches the width Next asks for.
 *
 *   /photos/mob-p01-a.jpg  +  width 800  ->  /photos/mob-p01-a@800.jpg
 *
 * JPEG rather than AVIF on purpose. A custom loader bypasses Next's `<picture>`
 * generation entirely — it emits one srcset and no fallback, which was verified
 * on the built HTML: zero `<picture>` tags. Pointing it at AVIF would therefore
 * hand a blank page to anything older than Safari 16.4. Nearly all of the byte
 * saving here comes from resizing, not from the format, so this trades a little
 * weight for correctness on older phones, which is most of the audience.
 *
 * The `src` this receives is whatever `photo()` returned — an un-suffixed seed
 * path. Nothing in the app should ever reference a generated variant by name;
 * that is this function's whole job.
 */
export default function maleOrderImageLoader({
  src,
  width,
}: ImageLoaderProps): string {
  // Only our own photographs are pre-resized. Anything else (a remote asset,
  // an SVG) is passed through untouched rather than pointed at a missing file.
  if (!src.startsWith("/photos/")) return src;

  const stem = src.replace(/\.(jpe?g|png|avif)$/i, "");
  return `${stem}@${width}.jpg`;
}