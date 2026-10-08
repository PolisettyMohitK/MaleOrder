"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { surfaceSpring, withReduce } from "@/components/motion/surface";
import { CloseIcon } from "@/components/ui/Icons";

export interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryProps {
  images: GalleryImage[];
  name: string;
}

/**
 * Product gallery.
 *
 * Mobile: one swipeable strip, snap-scrolled, tap to open full screen.
 * Desktop: one large photograph with a hover zoom that tracks the cursor,
 * plus a column of thumbnails.
 */
export function Gallery({ images, name }: GalleryProps) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const current = images[active] ?? images[0];

  /* Set the zoom origin directly on the node — no re-render per mousemove. */
  const onMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const node = frameRef.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 100;
    const y = ((event.clientY - box.top) / box.height) * 100;
    node.style.setProperty("--zoom-x", `${x}%`);
    node.style.setProperty("--zoom-y", `${y}%`);
  }, []);

  return (
    <>
      {/* Desktop: thumbnail rail + large frame */}
      <div className="hidden gap-5 lg:grid lg:grid-cols-[84px_1fr]">
        <ul className="flex flex-col gap-3">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1} of ${images.length}: ${image.alt}`}
                aria-current={index === active}
                className={`media-frame block aspect-[3/4] w-full transition-opacity duration-500 ${
                  index === active
                    ? "opacity-100 outline outline-1 outline-offset-2 outline-silver-400"
                    : "opacity-55 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="84px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>

        <div
          ref={frameRef}
          onMouseMove={onMouseMove}
          className="media-frame group relative aspect-[4/5] cursor-zoom-in overflow-hidden [--zoom-x:50%] [--zoom-y:50%]"
        >
          <span className="skeleton" aria-hidden="true" />
          <Image
            key={current.src}
            src={current.src}
            alt=""
            fill
            preload
            sizes="(min-width: 1024px) 40vw, 92vw"
            style={{ transformOrigin: "var(--zoom-x, 50%) var(--zoom-y, 50%)" }}
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.7]"
          />
          <p className="label absolute right-4 bottom-4 z-[2] text-silver-300 mix-blend-difference">
            Hover to zoom
          </p>
        </div>
      </div>

      {/* Mobile: swipeable strip */}
      <div className="lg:hidden">
        <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((image, index) => (
            <li key={image.src} className="w-[86vw] shrink-0 snap-center">
              {/* The photograph is decorative here — the product name is
                  already the page heading — so the button carries its own
                  name rather than borrowing the image's alt text. */}
              <button
                type="button"
                onClick={() => setLightbox(true)}
                aria-label={`Enlarge photograph ${index + 1} of ${images.length}`}
                className="media-frame block aspect-[4/5] w-full"
              >
                <span className="skeleton" aria-hidden="true" />
                <Image
                  src={image.src}
                  alt=""
                  fill
                  preload={image.src === images[0].src}
                  sizes="86vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
        <p className="label mt-3 text-muted">
          Swipe for more · tap to enlarge
        </p>
      </div>

      {/* Full-screen lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="on-dark fixed inset-0 z-[110] origin-top flex flex-col bg-ink"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
            transition={withReduce(reduce, surfaceSpring)}
            role="dialog"
            aria-modal="true"
            aria-label={`${name} photographs`}
            onClick={() => setLightbox(false)}
          >
            <div className="flex h-16 shrink-0 items-center justify-between px-5">
              <span className="label text-muted">{name}</span>
              <button
                type="button"
                onClick={() => setLightbox(false)}
                aria-label="Close"
                className="label tap -mr-2 flex items-center gap-2 px-2 text-bone"
              >
                Close
                <CloseIcon width={18} height={18} />
              </button>
            </div>

            <ul
              className="flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onClick={(event) => event.stopPropagation()}
            >
              {images.map((image) => (
                <li key={image.src} className="w-full shrink-0 snap-center">
                  <div className="media-frame relative h-full w-full">
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      sizes="100vw"
                      className="object-contain"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}