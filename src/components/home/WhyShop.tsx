import { FabricIcon, FitIcon, StoreIcon } from "@/components/ui/Icons";

const REASONS = [
  {
    icon: FabricIcon,
    title: "Honest fabrics",
    body: "We tell you the composition, the weight and where it came from. If a fabric will not last, we will not stock it.",
  },
  {
    icon: FitIcon,
    title: "Fits you properly",
    body: "Alterations are free in store, and we will happily re-measure over WhatsApp if you are between sizes.",
  },
  {
    icon: StoreIcon,
    title: "Real store, real people",
    body: "The same counter, the same people who measure you. Nothing here is fulfilled by a warehouse we have never visited.",
  },
];

export function WhyShop() {
  return (
    <section className="section-y bg-paper" aria-labelledby="why-heading">
      <div className="shell">
        <div data-reveal="up">
          <p className="label text-muted">Why shop with us</p>
          <h2
            id="why-heading"
            data-reveal="sheen"
            data-lines
            className="t-head type-silver mt-5 max-w-2xl"
          >
            Three things we will not compromise on.
          </h2>
        </div>

        <div
          data-reveal="up"
          data-reveal-stagger
          className="mt-14 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8"
        >
          {REASONS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="border-t border-silver-500/25 pt-8">
              <Icon width={26} height={26} className="text-silver-400" />
              <h3 className="t-head type-silver mt-7 text-[1.6rem] md:text-[1.75rem]">
                {title}
              </h3>
              <p className="t-body mt-4 max-w-sm text-neutral-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}