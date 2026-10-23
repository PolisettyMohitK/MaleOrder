"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { store } from "@/data/store.config";
import { CROP, photo } from "@/lib/images";
import { GENERAL_ENQUIRY, waLink } from "@/lib/whatsapp";
import { DURATION, EASE, gsap, useGSAP } from "@/components/motion/gsap";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  PauseIcon,
  PlayIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";

/** How long each slide holds before the next one. */
const INTERVAL = 6;

/**
 * Hero backgrounds. Free Unsplash photographs, not our products: the hero is
 * full-bleed, and the shop's own photos are too small to be stretched that
 * wide. Each slide links to the collection it resembles, never to a product.
 */
const SLIDES = [
  { seed: "stock-hero-1", name: "Kurta Pajama", note: "For haldi and day ceremonies", href: "/collections/kurta-pajama" },
  { seed: "stock-hero-5", name: "Office Casuals", note: "Crisp cotton for the work week", href: "/collections/office-casuals" },
  { seed: "stock-hero-2", name: "Kurta Pajama", note: "Rich colours for festive evenings", href: "/collections/kurta-pajama" },
  { seed: "stock-hero-6", name: "Office Casuals", note: "Smart shirts, easy fits", href: "/collections/office-casuals" },
  { seed: "stock-hero-3", name: "Kurta Pajama", note: "Dark sets for night functions", href: "/collections/kurta-pajama" },
  { seed: "stock-hero-4", name: "Kurta Pajama", note: "Printed cotton for every day", href: "/collections/kurta-pajama" },
];

/**
 * The hero: a slow, moving carousel of looks from the two collections, with
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
  const slides = SLIDES;
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
      aria-label={`${current.name}, and other looks from the collection`}
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
      {/* Slides

          Only the current slide and the next one are actually rendered. Every
          slide is `absolute inset-0`, so they all intersect the viewport and
          `loading="lazy"` does nothing for them — the browser downloads all
          six at once, which was around 480KB of photography before the first
          byte of text. Keeping the rest out of the DOM until the carousel
          approaches them cuts that to two images.

          A one-slide runway is deliberate: autoplay holds a slide for six
          seconds, which is far longer than the next image takes to arrive,
          so a transition never waits on the network. */}
      <div
        className="absolute inset-0"
        aria-live={playing ? "off" : "polite"}
        aria-atomic="true"
      >
        {slides.map((slide, i) => {
          const rendered = i <= index + 1;

          return (
          <div
            key={slide.seed}
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
            {rendered ? (
              <Image
                src={photo(slide.seed, CROP.slide.w, CROP.slide.h)}
                alt=""
                fill
                preload={i === 0}
                loading={i === 0 ? undefined : "lazy"}
                sizes="100vw"
                className="object-cover blur-[3px]"
              />
            ) : null}
          </div>
          );
        })}

        {/* Scrim. Dark at the top for the header and at the bottom for the
            controls, light through the middle. The photographs themselves
            carry a slight blur, so they set the mood without pulling focus
            from the greeting. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[2] bg-[linear-gradient(to_bottom,rgba(10,10,10,0.6)_0%,rgba(10,10,10,0.2)_30%,rgba(10,10,10,0.25)_62%,rgba(10,10,10,0.85)_100%)]"
        />
      </div>

      {/* Greeting. Short enough that the shop starts just below the fold. */}
      <div className="relative z-[3] flex min-h-[78svh] flex-col justify-center px-5 pt-28 pb-36 text-center sm:px-8 lg:min-h-[88svh]">
        <div className="relative mx-auto w-full max-w-3xl [text-shadow:0_1px_14px_rgba(0,0,0,0.55)]">
          <p className="eyebrow text-bone/90">Shirts · Kurta sets · {store.city}</p>

          <h1 className="type-silver-dark t-display mt-5">
            Shirts and kurta sets, ready to wear.
          </h1>

          <p className="t-body mx-auto mt-5 max-w-md text-bone/90">
            From our shop in {store.city}. Order on WhatsApp, pay on delivery.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/#shop" className="btn btn-paper w-full [text-shadow:none] sm:w-auto">
              Shop now
              <ArrowRightIcon width={16} height={16} />
            </Link>
            <a
              href={waLink(GENERAL_ENQUIRY)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa w-full [text-shadow:none] sm:w-auto"
            >
              <WhatsAppIcon width={17} height={17} />
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Slide caption. On phones it sits just above the floating WhatsApp
          button, which is in the bottom-right corner. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-20 z-[4] px-5 sm:bottom-24 sm:px-8">
        <div className="mx-auto flex max-w-6xl justify-center sm:justify-start">
          <Link
            key={current.seed}
            href={current.href}
            className="pointer-events-auto flex items-center gap-4 transition-opacity duration-700"
          >
            <span className="block text-left">
              <span className="label hidden text-bone/80 sm:block">{current.note}</span>
              <span className="block text-sm font-medium leading-tight text-bone sm:mt-1 sm:text-base">
                {current.name}
              </span>
            </span>
            {/* The fill is the point here. This badge had `backdrop-blur-sm`
                with no background at all, so the blur had nothing to blur but
                the photograph itself and the bone text sat directly on that
                smear — over a bright part of the hero it read as blurred,
                illegible type. Ink/45 gives the text a real surface while
                keeping the hero visible through it. */}
            <span className="label flex items-center gap-2 rounded-full border border-white/30 bg-ink/45 px-4 py-2 text-bone backdrop-blur-sm transition-colors duration-500 hover:border-white/70">
              View
              <ArrowUpRightIcon width={14} height={14} />
            </span>
          </Link>
        </div>
      </div>

      {/* Controls. Centred and narrow on phones, so they stay clear of the
          floating WhatsApp button in the corner; padded away from it on
          larger screens. */}
      <div className="absolute inset-x-0 bottom-5 z-[4] px-5 sm:bottom-6 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 sm:justify-between sm:pr-24 lg:pr-28">
          {/* Phones get the counter instead of the dots: six 44px dot targets
              plus the pause button are wider than a 375px screen. */}
          <p className="label text-bone/80">
            <span className="tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="px-2 text-bone/50">/</span>
            <span className="tabular-nums">
              {String(slides.length).padStart(2, "0")}
            </span>
          </p>

          <div className="flex items-center gap-3">
            <ul className="hidden items-center gap-2 sm:flex">
              {slides.map((slide, i) => (
                <li key={slide.seed}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show slide ${i + 1}: ${slide.name}`}
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

            {/* Icon only, but kept: WCAG 2.2.2 needs a way to stop autoplay. */}
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              className="tap flex items-center justify-center rounded-full text-bone/80 transition-colors duration-500 hover:text-bone"
            >
              {playing ? (
                <PauseIcon width={14} height={14} />
              ) : (
                <PlayIcon width={14} height={14} />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}