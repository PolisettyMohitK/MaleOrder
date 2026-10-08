import { store } from "@/data/store.config";
import { waLink, GENERAL_ENQUIRY } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icons";

const BULLETS = [
  `Visit us in ${store.area}, ${store.city}`,
  "Order easily on WhatsApp",
  "Free alterations in store",
];

export function AnnouncementBar() {
  return (
    <div className="on-dark flex h-9 items-center justify-center overflow-hidden border-b border-white/10 bg-ink px-4">
      <p className="label flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[0.5625rem] text-silver-200 sm:text-[0.625rem]">
        {/* The bar is a fixed 36px tall, so on small screens it carries only
            the one line that actually asks something of the visitor. */}
        <span className="hidden sm:inline">{BULLETS[0]}</span>

        <span className="inline-flex items-center gap-3">
          <span aria-hidden="true" className="hidden text-silver-500 sm:inline">
            •
          </span>
          <a
            href={waLink(GENERAL_ENQUIRY)}
            target="_blank"
            rel="noopener noreferrer"
            className="tap -my-2 inline-flex items-center gap-2 py-2 transition-colors duration-500 hover:text-silver-100"
          >
            <WhatsAppIcon width={12} height={12} />
            {BULLETS[1]}
          </a>
        </span>

        <span className="hidden items-center gap-3 sm:inline-flex">
          <span aria-hidden="true" className="text-silver-500">
            •
          </span>
          <span>{BULLETS[2]}</span>
        </span>
      </p>
    </div>
  );
}