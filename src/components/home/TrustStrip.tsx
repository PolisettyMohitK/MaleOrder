import { store } from "@/data/store.config";
import { CashIcon, FitIcon, StoreIcon, WhatsAppIcon } from "@/components/ui/Icons";

/** The four reasons to order, set right under the hero. */
export const TRUST_POINTS = [
  { Icon: FitIcon, title: "Free alterations", text: "In store, usually same day" },
  { Icon: CashIcon, title: "Pay on delivery", text: "Or pay when you collect" },
  { Icon: WhatsAppIcon, title: "Order on WhatsApp", text: "One tap, we reply fast" },
  { Icon: StoreIcon, title: "Real shop", text: `Visit us in ${store.city}` },
];

export function TrustStrip() {
  return (
    <section aria-label="Why order from us" className="border-b border-silver-500/20 bg-paper">
      <ul className="shell grid grid-cols-2 gap-x-4 gap-y-6 py-8 md:grid-cols-4 md:py-10">
        {TRUST_POINTS.map(({ Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Icon width={20} height={20} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">{title}</span>
              <span className="mt-0.5 block text-sm text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
