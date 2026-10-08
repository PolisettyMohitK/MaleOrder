/**
 * ============================================================================
 *  STORE CONFIG — EDIT THIS FILE AND NOWHERE ELSE
 * ============================================================================
 *  Everything that is specific to Male Order lives here.
 *  Every value below marked PLACEHOLDER is a demo stand-in.
 *  Search this file for "PLACEHOLDER" to find them all.
 */

export const store = {
  /** Wordmark. Rendered on one line, with `tagline` beneath it. */
  name: "Male Order",
  shortName: "Male Order",
  /**
   * TAGLINE, NOT A LOCATION.
   * Set under the wordmark as a brand line. The shop is in Ahmedabad; "Erise"
   * is the line we sit under the name, nothing more. Anything that tells a
   * customer where we are must use `city`, not this.
   */
  tagline: "Erise",
  /** The actual location. This is what customers are told. */
  city: "Ahmedabad",
  state: "Gujarat",

  /** Brand promise. The one-line reason to shop us, used in metadata. */
  promise: "Tailored for work. Made for celebrations.",

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

  /** PLACEHOLDER — confirm the street address in Ahmedabad. */
  address: {
    line1: "Shop 3, Silver Arcade",
    line2: "Station Road",
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
  directionsQuery: "Menswear shop, Ahmedabad, Gujarat",

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

/** The brand lockup, flattened. "Male Order Erise" — name plus tagline. */
export const fullName = `${store.name} ${store.tagline}`;

/**
 * The location line. Built from the city, never from the tagline — "Erise" is
 * a brand line and does not appear in anything that tells a customer where the
 * shop is.
 */
export const placeLine = `${store.city}, ${store.state}`;

export const addressLines: string[] = [
  store.address.line1,
  store.address.line2,
  `${store.address.city}, ${store.address.state} ${store.address.postcode}`,
];

export const directionsQuery = encodeURIComponent(store.directionsQuery);