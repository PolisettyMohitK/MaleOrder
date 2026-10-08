import { store } from "@/data/store.config";

/** Builds a wa.me deep link with the message pre-filled. */
export function waLink(message: string): string {
  return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Message behind the floating button that sits on every page. */
export const GENERAL_ENQUIRY = "Hi, I'm interested in your collection.";

/** Message behind the floating button when shown inside a category page. */
export function collectionEnquiry(categoryName: string): string {
  return `Hi, I'd like to see more from your ${categoryName} collection.`;
}

/**
 * Message built on the product page. Size and colour are only included once
 * the visitor has actually picked one, so the shop never receives half an
 * order by accident.
 */
export function orderMessage(
  productName: string,
  options?: { size?: string | null; colour?: string | null },
): string {
  const parts = [`Hi, I'd like to order ${productName}`];
  if (options?.size) parts.push(`size ${options.size}`);
  if (options?.colour) parts.push(`colour ${options.colour}`);
  parts.push(".");
  return parts.join(", ");
}

/** Used by the contact form fallback when messaging is the easier route. */
export function supportMessage(detail?: string): string {
  const base = "Hi, I have a question about your collection";
  return detail ? `${base}: ${detail}` : `${base}.`;
}