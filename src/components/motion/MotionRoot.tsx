"use client";

import { usePathname } from "next/navigation";
import {
  DURATION,
  EASE,
  gsap,
  registerPlugins,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from "./gsap";

/**
 * Scroll choreography, driven entirely by `data-reveal` attributes on the
 * markup. Elements stay server-rendered and no wrapper component is needed,
 * which keeps their code out of the client bundle.
 *
 *   data-reveal="up"      fade and rise
 *   data-reveal="clip"    wipe the frame open while the photograph settles
 *   data-reveal="scrub"   parallax tied to scroll (data-parallax sets travel)
 *   data-reveal="sheen"   scrub the silver specular highlight across the text
 *
 * Modifiers, which combine with any of the above:
 *   data-reveal-stagger   fan the effect out across the element's children
 *   data-lines            add a masked per-line headline rise
 *
 * WHY THIS RE-SCANS THE DOM
 * -------------------------
 * Cache Components streams the page, so a client component mounted in the root
 * layout can run before later sections have arrived. On the home page
 * everything is prerendered and it works; on a streamed page the tail sections
 * were never picked up and stayed stuck at their hidden start state.
 *
 * So each element is processed exactly once — flagged with `data-reveal-done` —
 * and a MutationObserver re-runs the scan whenever new reveal elements appear.
 * Already-processed nodes are skipped, so repeated scans are harmless.
 *
 * Everything is inside gsap.matchMedia, so a visitor who has asked for reduced
 * motion gets a static page and no animation is ever created.
 */

/** Records which effects have already run, per element. */
const DONE = "data-reveal-done";

/**
 * Effects are tracked individually. An element can legitimately carry more than
 * one (a heading that is both `data-reveal="sheen"` and `data-lines`), so a
 * single "already handled" flag would let the first effect suppress the rest.
 */
function fresh(selector: string, effect: string): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !(el.getAttribute(DONE) ?? "").split(" ").includes(effect),
  );
}

function mark(el: Element, effect: string) {
  const list = (el.getAttribute(DONE) ?? "").split(" ").filter(Boolean);
  if (list.includes(effect)) return;
  list.push(effect);
  el.setAttribute(DONE, list.join(" "));
}

export function MotionRoot() {
  const pathname = usePathname();

  useGSAP(
    () => {
      registerPlugins();

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        function scan() {
          /* ---- fade and rise ---- */
          fresh("[data-reveal='up']", "up").forEach((el) => {
            const targets = el.hasAttribute("data-reveal-stagger")
              ? Array.from(el.children)
              : [el];

            /* fromTo, never from: the stylesheet already sets opacity 0 as the
               no-flash start state, so `from` would resolve its end value to
               that same 0 and animate nothing. */
            gsap.fromTo(
              targets,
              { opacity: 0, y: 26 },
              {
                opacity: 1,
                y: 0,
                duration: DURATION.base,
                ease: EASE,
                stagger: 0.075,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              },
            );
            mark(el, "up"); targets.forEach((t) => mark(t, "up"));
          });

          /* ---- photograph wipe ---- */
          fresh("[data-reveal='clip']", "clip").forEach((frame) => {
            const img = frame.querySelector("img");

            const timeline = gsap.timeline({
              scrollTrigger: { trigger: frame, start: "top 85%", once: true },
            });

            // Both properties are animated explicitly. The stylesheet hides the
            // frame with opacity AND a clip, so animating only the clip would
            // leave every wiped image permanently invisible.
            timeline.fromTo(
              frame,
              { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" },
              {
                opacity: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                duration: DURATION.slow,
                ease: EASE,
              },
              0,
            );

            if (img) {
              timeline.fromTo(
                img,
                { scale: 1.12 },
                { scale: 1, duration: DURATION.slow + 0.4, ease: EASE },
                0,
              );
            }
            mark(frame, "clip");
          });

          /* ---- parallax ---- */
          fresh("[data-reveal='scrub']", "scrub").forEach((el) => {
            const distance = Number(el.dataset.parallax ?? 14);
            gsap.fromTo(
              el,
              { yPercent: -distance },
              {
                yPercent: distance,
                ease: "none",
                scrollTrigger: {
                  trigger: el.parentElement ?? el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
            mark(el, "scrub");
          });

          /* ---- silver sheen sweep ---- */
          fresh("[data-reveal='sheen']", "sheen").forEach((el) => {
            gsap.fromTo(
              el,
              { "--sheen-x": "100%" },
              {
                "--sheen-x": "-20%",
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top 95%",
                  end: "bottom 5%",
                  scrub: 0.6,
                },
              },
            );
            mark(el, "sheen");
          });

          /* ---- masked headline lines ---- */
          fresh("[data-lines]", "lines").forEach((el) => {
            const split = new SplitText(el, { type: "lines", mask: "lines" });

            // The wrapper is CSS-hidden; reveal it now while the line masks keep
            // the glyphs out of sight until the scroll trigger fires.
            gsap.to(el, { opacity: 1, duration: 0.4, ease: "none" });

            gsap.from(split.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: EASE,
              stagger: 0.09,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
              onComplete: () => split.revert(),
            });
            mark(el, "lines");
          });
        }

        scan();

        /* Late-arriving sections. Debounced because streamed HTML lands in
           bursts and each pass is cheap but not free. */
        let pending: number | undefined;
        const observer = new MutationObserver(() => {
          window.clearTimeout(pending);
          pending = window.setTimeout(scan, 120);
        });
        observer.observe(document.body, { childList: true, subtree: true });

        /* Late images change how tall everything is, so the measurements every
           trigger was built from need recalculating. */
        const onLoad = () => ScrollTrigger.refresh();
        window.addEventListener("load", onLoad);

        return () => {
          observer.disconnect();
          window.clearTimeout(pending);
          window.removeEventListener("load", onLoad);
        };
      });

      return () => {
        mm.revert();
        // Forget which nodes were handled, so a later scan re-picks them up
        // rather than leaving them stuck mid-animation.
        document
          .querySelectorAll(`[${DONE}]`)
          .forEach((el) => el.removeAttribute(DONE));
      };
    },
    { dependencies: [pathname] },
  );

  return null;
}