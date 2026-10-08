import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icons";

interface FloatingWhatsAppProps {
  /** Message to pre-fill. Defaults to the general collection enquiry. */
  message: string;
}

/**
 * Present on every page. Black circle, silver ring, white glyph, slow pulse.
 * Ordering happens on WhatsApp, so this is the primary call to action for
 * the whole site.
 */
export function FloatingWhatsApp({ message }: FloatingWhatsAppProps) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message us on WhatsApp"
      className="wa-pulse fixed right-5 bottom-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full border border-silver-400 bg-ink text-bone shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 sm:right-8 sm:bottom-8 sm:h-16 sm:w-16"
    >
      <WhatsAppIcon width={26} height={26} className="relative" />
    </a>
  );
}