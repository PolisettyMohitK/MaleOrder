import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/PageTransition";
import Link from "next/link";

import { ContactForm } from "@/components/support/ContactForm";
import { Faq } from "@/components/support/Faq";
import {
  ClockIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";
import { addressLines, store } from "@/data/store.config";
import { GENERAL_ENQUIRY, waLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Support & Contact",
  description:
    "Questions about sizing, delivery or alterations? Message Male Order Erise on WhatsApp, call the shop, or send us a message here.",
};

const FAQ = [
  {
    question: "How do I order?",
    answer:
      "There is no basket on this site. Find a piece you like, choose a size and a colour if you know them, then tap Order on WhatsApp. The message is written out for you. We confirm availability and size, and that is it.",
  },
  {
    question: "I am between two sizes. What should I do?",
    answer:
      "Take the larger one if it is a fitted style, the smaller one if it is a relaxed cut. Every product page has a size guide with chest and waist measurements in inches. If you are still unsure, message us on WhatsApp with your chest measurement and we will tell you which one to order.",
  },
  {
    question: "Do you deliver?",
    answer:
      "Yes, across India. We will send you the shipping charge along with the confirmation, before anything is dispatched. If you would rather collect, the shop on Station Road is open six days a week and we can have it pressed and ready for you.",
  },
  {
    question: "Can I exchange something?",
    answer:
      "Yes, within seven days, unworn and with the tags on. Message us and we will arrange the pickup or swap. Alterations in store are free and usually take the same day.",
  },
  {
    question: "Can I visit the store?",
    answer:
      "Please do. Everything on this site is on the rail in store, so trying a fabric on is always better than looking at a screen. Opening hours are on this page and on the footer of every page.",
  },
];

export default function SupportPage() {
  return (
    <PageTransition>
    <div className="pt-[100px] md:pt-[108px]">
      {/* Heading */}
      <section className="bg-bone" aria-labelledby="support-heading">
        <div className="shell pt-16 pb-14 md:pt-24 md:pb-20">
          <p className="label text-muted">Support &amp; contact</p>
          <div data-reveal="up">
            <h1 id="support-heading" className="t-display shine mt-7 max-w-3xl">
              We&rsquo;re here to help.
            </h1>
            <p className="t-body mt-7 max-w-xl text-neutral-600">
              Ask about a size, a fabric, a delivery or a visit. The quickest
              answer is a WhatsApp message — a person at the shop reads them
              during opening hours.
            </p>
          </div>
        </div>
      </section>

      {/* Form + WhatsApp */}
      <section className="bg-paper py-20 md:py-28">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div data-reveal="up">
              <h2 className="t-head shine">Send us a message</h2>
              <div className="mt-10">
                <ContactForm storeName={store.shortName} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div data-reveal="up">
              <div className="border border-silver-500/25 p-8 md:p-10">
                <h2 className="t-head text-[1.75rem] md:text-[2rem]">
                  Or just message us
                </h2>
                <p className="t-body mt-5 text-neutral-600">
                  WhatsApp is where we handle everything — orders, alterations,
                  stock questions and the occasional photo of a colour you are
                  thinking about.
                </p>
                <a
                  href={waLink(GENERAL_ENQUIRY)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ink mt-8 w-full"
                >
                  <WhatsAppIcon width={16} height={16} />
                  Open WhatsApp
                </a>
                <p className="label mt-6 text-muted">
                  {store.phone} · {store.city}
                </p>
              </div>

              <dl className="mt-10 space-y-7">
                <div className="flex gap-4">
                  <dt className="shrink-0">
                    <PinIcon width={19} height={19} className="text-muted" />
                    <span className="sr-only">Address</span>
                  </dt>
                  <dd>
                    <address className="t-body not-italic">
                      {addressLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                    <Link
                      href="/#visit"
                      className="label link-draw mt-3 inline-block text-ink"
                    >
                      Directions
                    </Link>
                  </dd>
                </div>

                <div className="flex gap-4">
                  <dt className="shrink-0">
                    <PhoneIcon width={19} height={19} className="text-muted" />
                    <span className="sr-only">Phone</span>
                  </dt>
                  <dd className="t-body">
                    <a
                      href={`tel:${store.phone.replace(/\s/g, "")}`}
                      className="link-draw"
                    >
                      {store.phone}
                    </a>
                  </dd>
                </div>

                <div className="flex gap-4">
                  <dt className="shrink-0">
                    <MailIcon width={19} height={19} className="text-muted" />
                    <span className="sr-only">Email</span>
                  </dt>
                  <dd className="t-body">
                    <a
                      href={`mailto:${store.email}`}
                      className="link-draw break-all"
                    >
                      {store.email}
                    </a>
                  </dd>
                </div>

                <div className="flex gap-4">
                  <dt className="shrink-0">
                    <ClockIcon width={19} height={19} className="text-muted" />
                    <span className="sr-only">Opening hours</span>
                  </dt>
                  <dd className="t-body">
                    {store.hours.map((slot) => (
                      <span key={slot.days} className="block">
                        <span className="text-neutral-600">{slot.days}</span>{" "}
                        {slot.time}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-bone py-20 md:py-28" id="visit" aria-labelledby="visit-heading">
        <div className="shell">
          <div data-reveal="up">
            <p className="label text-muted">Find us</p>
            <h2 id="visit-heading" className="t-head shine mt-5">
              {store.address.line2}
            </h2>
          </div>
          <div data-reveal="up">
            <div className="draw-border mt-10 overflow-hidden">
              <iframe
                title={`Map showing ${store.name} in ${store.city}`}
                src={store.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[24rem] w-full border-0 grayscale contrast-[1.05] md:h-[30rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-paper py-20 md:py-28" aria-labelledby="faq-heading">
        <div className="shell">
          <div data-reveal="up">
            <p className="label text-muted">Questions</p>
            <h2 id="faq-heading" className="t-head shine mt-5">
              The five we get asked most.
            </h2>
          </div>
          <div data-reveal="up">
            <div className="mt-12">
              <Faq items={FAQ} />
            </div>
          </div>
        </div>
      </section>
      </div>
    </PageTransition>
  );
}
