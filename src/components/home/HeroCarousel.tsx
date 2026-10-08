"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { categories, featuredProducts } from "@/data/products";
import { placeLine } from "@/data/store.config";
import { CROP, photo } from "@/lib/images";
import { DURATION, EASE, gsap, useGSAP } from "@/components/motion/gsap";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  PauseIcon,
  PlayIcon,
} from "@/components/ui/Icons";

/** How long each slide holds before the next one. */
const INTERVAL = 6;

/**
 * The hero: a slow, moving carousel of apparel from the two collections, with
 * the brand greeting held over the top.
 *
 * Accessibility notes, because an auto-advancing carousel is easy to get wrong:
 *   - WCAG 2.2.2 requires moving content that starts by itself to be
 *     pausable, so there is an explicit pause control.
 *   - Nothing is announced while it is moving. Once paused, slide changes are
 *     announced politely.
 *   - Arrow keys move between slides when the region has focus.
 *   - Visitors who have asked for reduced motion get no autoplay and no
 *     crossfade; the dots still work.
 *
 * Only the first slide is preloaded. The rest are lazy, which keeps the LCP
 * element on the first photograph.
 */
export function HeroCarousel() {
  const slides = featuredProducts(6);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion.current) setPlaying(false);
  }, []);

  /* Crossfade and settle the incoming slide. */
  useGSAP(
    () => {
      const nodes = slidesRef.current.filter(Boolean) as HTMLDivElement[];

      nodes.forEach((node, i) => {
        const img = node.querySelector("img");
        if (i === index) {
          gsap.set(node, { opacity: 1, zIndex: 1 });
          if (img && !reduceMotion.current) {
            gsap.fromTo(
              img,
              { scale: 1.08 },
              { scale: 1, duration: DURATION.slow + 1.6, ease: EASE },
            );
          }
        } else {
          gsap.set(node, { opacity: 0, zIndex: 0 });
        }
      });
    },
    { dependencies: [index] },
  );

  /* Autoplay, on GSAP's ticker so it pauses cleanly and respects the loop. */
  useEffect(() => {
    if (!playing || reduceMotion.current) return;
    const call = gsap.delayedCall(INTERVAL, () => {
      setIndex((current) => (current + 1) % slides.length);
    });
    return () => {
      call.kill();
    };
  }, [playing, index, slides.length]);

  const step = useCallback(
    (delta: number) => {
      setIndex((current) => (current + delta + slides.length) % slides.length);
    },
    [slides.length],
  );

  const current = slides[index];

  return (
    <section
      className="on-dark relative isolate bg-ink"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${current.name} and other pieces from the collection`}
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          step(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          step(-1);
        }
      }}
    >
      {/* Slides */}
      <div
        className="absolute inset-0"
        aria-live={playing ? "off" : "polite"}
        aria-atomic="true"
      >
        {slides.map((product, i) => (
          <div
            key={product.slug}
            ref={(node) => {
              slidesRef.current[i] = node;
            }}
            className="media-frame absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0 }}
            aria-hidden={i !== index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
          >
            <span className="skeleton" aria-hidden="true" />
            <Image
              src={photo(product.images[0].seed, CROP.slide.w, CROP.slide.h)}
              alt={product.images[0].alt}
              fill
              preload={i === 0}
              loading={i === 0 ? undefined : "lazy"}
              sizes="100vw"
              className="media-moody object-cover"
            />
          </div>
        ))}

        {/* Scrim. Two stacked gradients so white type stays legible over any
            photograph without flattening the image. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(10,10,10,0.78)_0%,rgba(10,10,10,0.45)_38%,rgba(10,10,10,0.5)_66%,rgba(10,10,10,0.92)_100%)]"
        />
      </div>

      {/* Brand greeting */}
      <div className="relative z-[3] flex min-h-dvh flex-col justify-center px-5 pt-28 pb-40 text-center sm:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <p className="label text-silver-200">
            {categories[0].shortName} · {categories[1].shortName} · {placeLine}
          </p>

          <h1 className="type-silver-dark t-display mt-7">
            <span className="block">Welcome to</span>
            <span className="mt-1 block sm:mt-2">Male Order Erise</span>
          </h1>

          <p className="t-body mx-auto mt-7 max-w-md text-bone/85">
            Tailored for work. Made for celebrations.
          </p>

          <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/collections/office-casuals" className="btn btn-paper w-full sm:w-auto">
              Shop Office Casuals
              <ArrowRightIcon width={15} height={15} />
            </Link>
            <Link href="/collections/kurta-pajama" className="btn btn-ghost w-full sm:w-auto">
              Shop Kurta Pajama
            </Link>
          </div>
        </div>
      </div>

      {/* Slide caption. Sits higher on small screens so it clears the
          floating WhatsApp button. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-44 z-[4] px-5 sm:bottom-28 sm:px-8">
        <div className="mx-auto flex max-w-6xl justify-center sm:justify-start">
          <Link
            key={current.slug}
            href={`/products/${current.slug}`}
            className="pointer-events-auto flex items-center gap-4 transition-opacity duration-700"
          >
            <span className="hidden text-left sm:block">
              <span className="label block text-silver-200">{current.fabric}</span>
              <span className="mt-1 block font-display text-lg text-bone">
                {current.name}
              </span>
            </span>
            <span className="label flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-bone backdrop-blur-sm transition-colors duration-500 hover:border-white/70">
              View
              <ArrowUpRightIcon width={14} height={14} />
            </span>
          </Link>
        </div>
      </div>

      {/* Controls. Raised on small screens and padded on large ones, so the
          pause control can never end up underneath the floating
          WhatsApp button. */}
      <div className="absolute inset-x-0 bottom-24 z-[4] px-5 sm:bottom-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 sm:justify-between sm:pr-24 lg:pr-28">
          <p className="label hidden text-silver-300 sm:block">
            <span className="tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="px-2 text-silver-500">/</span>
            <span className="tabular-nums">
              {String(slides.length).padStart(2, "0")}
            </span>
          </p>

          <div className="flex items-center gap-3">
            <ul className="flex items-center gap-2">
              {slides.map((product, i) => (
                <li key={product.slug}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show slide ${i + 1}: ${product.name}`}
                    aria-current={i === index}
                    className="tap flex h-8 w-5 items-center justify-center"
                  >
                    <span
                      className={`block h-px w-full transition-colors duration-500 ${
                        i === index ? "bg-bone" : "bg-white/35"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              className="tap flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-bone transition-colors duration-500 hover:border-white/60"
            >
              {playing ? (
                <PauseIcon width={13} height={13} />
              ) : (
                <PlayIcon width={13} height={13} />
              )}
              <span className="label">{playing ? "Pause" : "Play"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}