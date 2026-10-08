import Image from "next/image";
import Link from "next/link";
import { placeLine, store } from "@/data/store.config";
import { sitePhotos } from "@/lib/images";
import { ArrowUpRightIcon } from "@/components/ui/Icons";

export function StoryBand() {
  return (
    <section className="on-dark section-y bg-ink text-bone" aria-labelledby="story-heading">
      <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="draw-border relative lg:col-span-6" data-reveal="up">
          <div data-reveal="clip" className="media-frame aspect-[4/3]">
            <span className="skeleton" aria-hidden="true" />
            <Image
              src={sitePhotos.brandStory}
              alt={`Inside the ${store.name} store in ${placeLine}, racks of shirts and kurtas`}
              fill
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="object-cover"
            />
          </div>
          <p className="label mt-4 text-silver-300">{placeLine}</p>
        </div>

        <div className="lg:col-span-6">
          <div data-reveal="up">
            <p className="label text-silver-300">Our story</p>
            <h2
              id="story-heading"
              data-reveal="sheen"
              data-lines
              className="t-head type-silver-dark mt-5"
            >
              A store you can walk into, now at your fingertips.
            </h2>
          </div>

          <div data-reveal="up">
            <div className="t-body mt-8 space-y-5 text-neutral-300">
              <p>
                We have been fitting men in {placeLine} for years. Not a
                franchise, not a warehouse — one shop, a few people who know
                every hanger in it, and a habit of telling customers the truth
                about fit and fabric.
              </p>
              <p>
                This site is that same shop, minus the walk. Browse what is on the
                rail today, pick a size, and message us. We will confirm, alter if
                it needs it, and send it out.
              </p>
            </div>
          </div>

          <div data-reveal="up">
            <Link href="/story" className="btn btn-ghost mt-10">
              Read our story
              <ArrowUpRightIcon width={15} height={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}