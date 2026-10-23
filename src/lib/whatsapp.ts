import { categoryName, type Product } from "@/data/products";
import { store } from "@/data/store.config";

/** Builds a wa.me deep link with the message pre-filled. */
export function waLink(message: string): string {
  return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Full link to a product page, so the shop sees exactly which piece. */
export function productUrl(slug: string): string {
  return `${store.siteUrl}/products/${slug}/`;
}

/** Message behind the general WhatsApp buttons. */
export const GENERAL_ENQUIRY = `Hi ${store.name}, I'm browsing your website and have a question about your collection.`;

/** Message behind the floating button when shown inside a category page. */
export function collectionEnquiry(categoryName: string): string {
  return `Hi ${store.name}, I'm looking at your ${categoryName} collection on your website. Could you tell me what is available in my size?`;
}

export interface OrderLine {
  product: Product;
  size: string | null;
  colour: string | null;
  qty: number;
}

function priceLine(product: Product): string {
  return product.price === null
    ? "please share the price"
    : `₹${product.price.toLocaleString("en-IN")}`;
}

/** The detail block for one piece, shared by single orders and the bag. */
function lineDetails(line: OrderLine, indent = ""): string[] {
  const { product } = line;
  return [
    `${indent}Category: ${categoryName(product.category)}`,
    `${indent}Fabric: ${product.fabric}`,
    `${indent}Colour: ${line.colour ?? "please suggest"}`,
    `${indent}Size: ${line.size ?? "not sure, please help me choose"}`,
    `${indent}Quantity: ${line.qty}`,
    `${indent}Price: ${priceLine(product)}`,
    `${indent}Link: ${productUrl(product.slug)}`,
  ];
}

/** Message for ordering one piece straight from its product page. */
export function orderMessage(line: OrderLine): string {
  return [
    `Hi ${store.name}, I'd like to order this piece:`,
    "",
    `*${line.product.name}*`,
    ...lineDetails(line, "• "),
    "",
    "Please confirm availability, the total and delivery. Thank you!",
  ].join("\n");
}

/** Message for ordering everything in the bag at once. */
export function bagMessage(lines: OrderLine[]): string {
  const pieces = lines.reduce((total, line) => total + line.qty, 0);
  return [
    `Hi ${store.name}, I'd like to order ${pieces === 1 ? "this piece" : `these ${pieces} pieces`} from my bag:`,
    "",
    ...lines.flatMap((line, index) => [
      `*${index + 1}. ${line.product.name}*`,
      ...lineDetails(line, "   • "),
      "",
    ]),
    `Total: ${lines.length} ${lines.length === 1 ? "item" : "items"}, ${pieces} ${pieces === 1 ? "piece" : "pieces"}.`,
    "Please confirm availability, the total and delivery. Thank you!",
  ].join("\n");
}

/** Message behind "Ask about my size" in the size guide. */
export function sizeHelpMessage(product: Product, size: string | null): string {
  return [
    `Hi ${store.name}, I need help choosing a size for:`,
    "",
    `*${product.name}*`,
    `• Size I was looking at: ${size ?? "not chosen yet"}`,
    `• Link: ${productUrl(product.slug)}`,
    "",
    "My height / chest / usual size is: ",
  ].join("\n");
}

/** Used by the contact form fallback when messaging is the easier route. */
export function supportMessage(detail?: string): string {
  const base = "Hi, I have a question about your collection";
  return detail ? `${base}: ${detail}` : `${base}.`;
}
