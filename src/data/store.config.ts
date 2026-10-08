/**
 * ============================================================================
 *  STORE CONFIG — EDIT THIS FILE AND NOWHERE ELSE
 * ============================================================================
 *  Everything that is specific to Male Order lives here.
 *  Every value below marked PLACEHOLDER is a demo stand-in.
 *  Search this file for "PLACEHOLDER" to find them all.
 */

export const store = {
  /** Wordmark. Rendered on one line, with `area` beneath it. */
  name: "Male Order",
  shortName: "Male Order",
  /** Shown under the wordmark, uppercased by the Logo component. */
  area: "Erise",
  city: "Ahmedabad",
  state: "Gujarat",

  tagline: "Tailored for work. Made for celebrations.",

  /**
   * PLACEHOLDER — replace with the real shop number.
   * Must be digits only, country code first, no +, spaces or dashes.
   * Used to build every wa.me link on the site.
   */
  whatsappNumber: "919879000000",

  /** PLACEHOLDER — real landline / mobile. */
  phone: "+91 98790 00000",

  /** PLACEHOLDER — real email. */
  email: "hello@maleorder.in",

  /** PLACEHOLDER — confirm the street address in Erise. */
  address: {
    line1: "Shop 3, Silver Arcade",
    line2: "Erise Main Road",
    city: "Ahmedabad",
    state: "Gujarat",
    postcode: "380001",
    country: "India",
  },

  /** PLACEHOLDER — confirm real opening hours. */
  hours: [
    { days: "Monday – Saturday", time: "10:30 am – 8:30 pm" },
    { days: "Sunday", time: "11:00 am – 6:00 pm" },
  ],

  /** Social handles — set `handle` to null to hide that icon. */
  social: [
    { label: "Instagram", handle: "maleordererise", url: "https://instagram.com/" },
    { label: "Facebook", handle: "maleordererise", url: "https://facebook.com/" },
  ],

  /** Free-text query used by the "Get directions" button. */
  directionsQuery: "Erise, Ahmedabad, Gujarat",

  /**
   * Embedded map. No API key needed — OpenStreetMap.
   *
   * PLACEHOLDER — `marker` is currently a general Ahmedabad coordinate.
   * Replace with the shop's exact latitude/longitude before launch, and
   * tighten `bbox` so the map opens zoomed on the storefront.
   * Filtered to greyscale in CSS.
   */
  mapEmbedUrl:
    "https://www.openstreetmap.org/export/embed.html?bbox=72.5300%2C23.0100%2C72.6300%2C23.0700&layer=mapnik&marker=23.0295%2C72.5714",

  /** Year for the footer copyright. Kept static so the build stays reproducible. */
  copyrightYear: 2026,

  /**
   * PLACEHOLDER — set this to the real domain before going live.
   * Used for Open Graph tags and absolute metadata URLs.
   */
  siteUrl: "https://maleorder.in",
} as const;

/** "Male Order Erise" — used in <title> and social tags. */
export const fullName = `${store.name} ${store.area}`;

/** "Erise, Ahmedabad" — the short place line used in banners and the footer. */
export const placeLine = `${store.area}, ${store.city}`;

export const addressLines: string[] = [
  store.address.line1,
  store.address.line2,
  `${store.address.city}, ${store.address.state} ${store.address.postcode}`,
];

export const directionsQuery = encodeURIComponent(store.directionsQuery);