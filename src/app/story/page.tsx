import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRightIcon,
  ClockIcon,
  FabricIcon,
  FitIcon,
} from "@/components/ui/Icons";
import { fullName, placeLine, store } from "@/data/store.config";
import { sitePhotos } from "@/lib/images";
import { waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Our Story",
  description: `${fullName} is a menswear shop in ${placeLine}. This is how it started, and what we promise every customer.`,
};

const FACTS = [
  {
    icon: ClockIcon,
    label: "When we opened",
    value: `A single counter on ${placeLine}`,
    note: "Long enough that some of our customers have bought from us before they got married.",
  },
  {
    icon: FabricIcon,
    label: "What we stand for",
    value: "Honest fabrics, plainly described",
    note: "We tell you the composition and the weight. If it will not last, we do not stock it.",
  },
  {
    icon: FitIcon,
    label: "What to expect",
    value: "Free alterations, in store, same day",
    note: "Bring it back, we will fix it. That has been the promise from day one.",
  },
];

const TEAM_PHOTOS = [
  { src: sitePhotos.teamOne, alt: `A shop assistant at the counter in ${placeLine}` },
  { src: sitePhotos.interiorOne, alt: "The menswear rail inside the store" },
  { src: sitePhotos.teamTwo, alt: "Shirts being folded at the back counter" },
  { src: sitePhotos.interiorTwo, alt: "Kurta sets hung on the back wall of the store" },
  { src: sitePhotos.teamThree, alt: "A customer being measured in store" },
];

export default function StoryPage() {
  return (
    <PageTransition>
    <div className="pt-[100px] md:pt-[108px]">
      {/* Opening image */}
      <section className="bg-bone" aria-labelledby="story-heading">
        <div className="shell pt-16 pb-14 md:pt-24 md:pb-20">
          <p className="label text-muted">Our story</p>
          <div data-reveal="up">
            <h1
              id="story-heading"
              data-reveal="sheen"
              data-lines
              className="t-display type-silver mt-7 max-w-4xl"
            >
              One shop in {store.city}, and now the same rail on your phone.
            </h1>
            <p className="t-body mt-7 max-w-xl text-neutral-600">
              A menswear shop that happens to have an online front now. Same
              counter, same people, same habit of telling you the truth about fit
              and fabric.
            </p>
          </div>
        </div>

        <div className="shell pb-16 md:pb-24" data-reveal="up">
          <div className="draw-border">
            <div data-reveal="clip" className="media-frame aspect-[16/9]">
              <span className="skeleton" aria-hidden="true" />
              <Image
                src={sitePhotos.storyOpening}
                alt={`The shopfront of ${fullName} in ${placeLine}`}
                fill
                preload
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
          <p className="label mt-4 text-muted">
            {fullName} · {placeLine}
          </p>
        </div>
      </section>

      {/* The story */}
      <section className="section-y bg-paper">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="sr-only">How we started</h2>

            <div data-reveal="up">
              <p className="t-body text-lg leading-relaxed text-ink">
                We started the way most good shops in this city start: with a
                counter, a rack, and a habit of asking what you actually wear to
                work on a Thursday.
              </p>
            </div>

            <div data-reveal="up">
              <p className="t-body mt-7 text-neutral-600">
                The men around here need to look right in a meeting and right at
                a wedding, sometimes on the same day. That is a narrow brief,
                and it turned out to be a useful one. It kept us from chasing
                trends we could not stock properly, and pushed us towards
                fabrics that breathe in this heat.
              </p>
            </div>

            <blockquote className="my-14 border-l border-silver-400 pl-7" data-reveal="up">
              <p className="t-quote type-silver">
                We would rather sell you one shirt that lasts four years than
                four that do not.
              </p>
            </blockquote>

            <div data-reveal="up">
              <p className="t-body text-neutral-600">
                Everything here is bought small and often. We see what sells, we
                ask why, and we bring back more of it. When something does not
                sell, it comes off the rail rather than sitting there for two
                seasons.
              </p>
            </div>

            <div data-reveal="up">
              <p className="t-body mt-7 text-neutral-600">
                This site was built to remove the drive, not the relationship.
                Order on WhatsApp and you are still talking to the person who
                would have measured you in store. Nothing is fulfilled by a
                warehouse we have never visited.
              </p>
            </div>

            <div data-reveal="up">
              <a
                href={waLink(
                  "Hi, I read your story on the website. I'd like to know more about the shop.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ink mt-11"
              >
                Come and say hello
              </a>
            </div>
          </div>

          {/* Facts */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32" data-reveal="up">
              <h2 className="label text-muted">The short version</h2>
              <dl className="mt-8 flex flex-col gap-8">
                {FACTS.map(({ icon: Icon, label, value, note }) => (
                  <div key={label} className="border-t border-silver-500/25 pt-6">
                    <dt className="flex items-center gap-3">
                      <Icon width={19} height={19} className="text-silver-400" />
                      <span className="label text-muted">{label}</span>
                    </dt>
                    <dd className="mt-3">
                      <p className="font-display text-xl font-light leading-snug">
                        {value}
                      </p>
                      <p className="t-body mt-2 text-neutral-600">{note}</p>
                    </dd>
                  </div>
                ))}
              </dl>

              <Link href="/collections/office-casuals" className="btn btn-ghost mt-10 w-full">
                See the collection
                <ArrowRightIcon width={15} height={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Photo strip */}
      <section className="section-y bg-bone" aria-labelledby="strip-heading">
        <div className="shell" data-reveal="up">
          <p className="label text-muted">Inside the shop</p>
          <h2
            id="strip-heading"
            data-reveal="sheen"
            data-lines
            className="t-head type-silver mt-5"
          >
            The people and the rail.
          </h2>
        </div>

        <ul
          data-reveal="up"
          data-reveal-stagger
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:mt-16 md:px-10 lg:px-14 [&::-webkit-scrollbar]:hidden"
        >
          {TEAM_PHOTOS.map((shot) => (
            <li
              key={shot.src}
              className="w-[68vw] shrink-0 snap-start sm:w-[40vw] lg:w-[22vw]"
            >
              <div data-reveal="clip" className="media-frame aspect-square">
                <span className="skeleton" aria-hidden="true" />
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 68vw"
                  className="object-cover"
                />
              </div>
            </li>
          ))}
          <li aria-hidden="true" className="hidden shrink-0 lg:block lg:w-0" />
        </ul>
      </section>
      </div>
    </PageTransition>
  );
}
