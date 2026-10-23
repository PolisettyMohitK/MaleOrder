import { waLink, GENERAL_ENQUIRY } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icons";

const BULLETS = ["Free alterations in store", "Order on WhatsApp", "Pay on delivery"];

export function AnnouncementBar() {
  return (
    <div className="flex h-9 items-center justify-center overflow-hidden bg-accent px-4">
      <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs font-medium text-paper">
        {/* The bar is a fixed 36px tall, so on small screens it carries only
            the one line that actually asks something of the visitor. */}
        <span className="hidden sm:inline">{BULLETS[0]}</span>

        <span className="inline-flex items-center gap-3">
          <span aria-hidden="true" className="hidden opacity-50 sm:inline">
            •
          </span>
          <a
            href={waLink(GENERAL_ENQUIRY)}
            target="_blank"
            rel="noopener noreferrer"
            className="tap -my-2 inline-flex items-center gap-2 py-2 underline-offset-4 hover:underline"
          >
            <WhatsAppIcon width={13} height={13} />
            {BULLETS[1]}
            <span className="sm:hidden">· {BULLETS[2]}</span>
          </a>
        </span>

        <span className="hidden items-center gap-3 sm:inline-flex">
          <span aria-hidden="true" className="opacity-50">
            •
          </span>
          <span>{BULLETS[2]}</span>
        </span>
      </p>
    </div>
  );
}
