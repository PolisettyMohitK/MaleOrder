import { placeLine, store } from "@/data/store.config";
import { GENERAL_ENQUIRY, waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icons";

const STEPS = [
  {
    title: "Pick what you like",
    body: "Browse the three collections. Choose a size and a colour. Nothing is added to a basket, because there is no basket.",
  },
  {
    title: "Message us on WhatsApp",
    body: "One tap from any product opens WhatsApp with your choices already written into the message. Edit it however you like.",
  },
  {
    title: "We confirm and send it to you",
    body: "We check availability, confirm the size, and either hand it over in store or dispatch it. You will hear from a person.",
  },
];

export function HowOrdering() {
  return (
    <section className="section-y bg-bone" aria-labelledby="how-heading">
      <div className="shell">
        <div
          data-reveal="up"
          className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <p className="label text-muted">How ordering works</p>
            <h2
              id="how-heading"
              data-reveal="sheen"
              data-lines
              className="t-head type-silver mt-5"
            >
              Three steps, then it is yours.
            </h2>
          </div>
          <a
            href={waLink(GENERAL_ENQUIRY)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ink shrink-0"
          >
            <WhatsAppIcon width={15} height={15} />
            Start a message
          </a>
        </div>

        <div
          data-reveal="up"
          data-reveal-stagger
          className="mt-14 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8"
        >
          {STEPS.map((step, index) => (
            <div key={step.title} className="border-t border-silver-500/25 pt-8">
              <p className="type-silver font-display text-6xl font-light leading-none md:text-7xl">
                0{index + 1}
              </p>
              <h3 className="t-head type-silver mt-6 text-[1.6rem] md:text-[1.75rem]">
                {step.title}
              </h3>
              <p className="t-body mt-4 max-w-sm text-neutral-600">{step.body}</p>
            </div>
          ))}
        </div>

        <div data-reveal="up">
          <p className="t-body mt-16 border-t border-silver-500/20 pt-8 text-neutral-600">
            Prefer to speak to someone? Call the shop on {store.phone} during
            opening hours and we will take it from there. We are on{" "}
            {placeLine}.
          </p>
        </div>
      </div>
    </section>
  );
}