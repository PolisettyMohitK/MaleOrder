import { store } from "@/data/store.config";

const STEPS = [
  { title: "Add pieces to your bag", body: "Pick a size, or skip it and we will help you choose." },
  { title: "Send your bag on WhatsApp", body: "Every piece, size and colour is written out for you. Just press send." },
  { title: "We confirm, you receive", body: "We deliver and you pay on delivery, or collect from the shop." },
];

export function HowOrdering() {
  return (
    <section className="bg-bone py-14 md:py-20" aria-labelledby="how-heading">
      <div className="shell">
        <div
          data-reveal="up"
          className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <p className="eyebrow">Three easy steps</p>
            <h2 id="how-heading" className="t-head type-silver mt-3">
              How to order
            </h2>
          </div>
        </div>

        <ol
          data-reveal="up"
          data-reveal-stagger
          className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-6"
        >
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4 rounded-sm bg-paper p-5 md:p-6">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-paper">
                {index + 1}
              </span>
              <span>
                <span className="block font-semibold text-ink">{step.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">{step.body}</span>
              </span>
            </li>
          ))}
        </ol>

        <p className="t-body mt-8 text-muted">
          Prefer to talk? Call us on{" "}
          <a
            href={`tel:${store.phone.replace(/\s/g, "")}`}
            className="font-medium text-ink underline underline-offset-4"
          >
            {store.phone}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
