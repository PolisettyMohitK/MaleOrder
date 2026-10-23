"use client";

import { usePathname } from "next/navigation";
import { getCategory } from "@/data/products";
import { collectionEnquiry, GENERAL_ENQUIRY, waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Icons";

/**
 * WhatsApp button on every page except product pages, which carry their own
 * order button and pinned order bar. On a collection page the message names
 * that collection, so the shop knows what the visitor was looking at.
 */
export function FloatingWhatsApp() {
  const pathname = usePathname();
  if (pathname.startsWith("/products/")) return null;

  const slug = pathname.match(/^\/collections\/([^/]+)/)?.[1];
  const category = slug ? getCategory(slug) : undefined;
  const message = category ? collectionEnquiry(category.name) : GENERAL_ENQUIRY;

  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message us on WhatsApp"
      className="fixed right-5 bottom-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 hover:bg-[#3a3633] sm:right-8 sm:bottom-8 sm:h-16 sm:w-16"
    >
      <WhatsAppIcon width={28} height={28} />
    </a>
  );
}
