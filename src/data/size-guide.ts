/**
 * SIZE GUIDE — edit this file to change the measurements shown on the
 * product page. Sizes are chest measurements in inches, which is how we fit
 * in store in Erise.
 */

export interface SizeRow {
  size: string;
  chest: string;
  waist: string;
}

export const sizeGuide: SizeRow[] = [
  { size: "S", chest: "38", waist: "32" },
  { size: "M", chest: "40", waist: "34" },
  { size: "L", chest: "42", waist: "36" },
  { size: "XL", chest: "44", waist: "38" },
  { size: "XXL", chest: "46", waist: "40" },
];

export const sizeGuideNotes = [
  "Measurements are chest, taken across the fullest part, in inches.",
  "Kurta lengths are 40–44 inches depending on the style. Trousers can be hemmed in store, free.",
  "Between two sizes? Take the larger one, or message us on WhatsApp and we will measure a sample for you.",
  "Alterations in store are free and usually take the same day.",
];