/* ============================================================================
 *  IMAGE SOURCE — EDIT THIS FILE AND NOWHERE ELSE
 * ============================================================================
 *  Every photograph on the site is requested through `photo()`.
 *  Product images use the `seed` stored in `src/data/products.json`.
 *
 *  THE DEMO (current state)
 *  ------------------------
 *  `seed` values are turned into desaturated placeholder photographs from
 *  picsum.photos so the layout can be judged at pitch quality.
 *
 *  SWAPPING IN THE REAL PHOTOGRAPHS
 *  --------------------------------
 *  1. Drop your files into  `public/photos/`
 *  2. Change the body of `photo()` to:
 *
 *       export function photo(seed: string) { return `/photos/${seed}.jpg` }
 *
 *  3. Rename each file in products.json to match its `seed`, e.g.
 *       public/photos/mob-p01-a.jpg
 *
 *  Recommended export: 1200x1600px JPEG, quality 80, sRGB, under 250 KB.
 *  A second angle per product is what makes the card hover work, so keep
 *  the a / b / c naming convention.
 * ========================================================================== */

export function photo(seed: string, _width?: number, _height?: number): string {
  return `/photos/${seed}.jpg`;
}

/* ---------- One consistent set of crops, so the grid never jumps ---------- */

export const CROP = {
  /** Product cards and the collection grid. 3:4 portrait. */
  product: { w: 900, h: 1200 },
  /** Product page gallery. 4:5 portrait. */
  gallery: { w: 1200, h: 1500 },
  /** Category tiles. 5:7 portrait. */
  tile: { w: 1000, h: 1400 },
  /** Full-bleed hero halves. 4:5 portrait. */
  hero: { w: 1200, h: 1500 },
  /** Hero carousel slides. Wide, for full-bleed backgrounds. */
  slide: { w: 1920, h: 1200 },
  /** Wide editorial crops for the story and lookbook. 4:3 and 3:2. */
  wide: { w: 1600, h: 1200 },
  /** Square-ish crops for team photos and value icons. 1:1. */
  square: { w: 800, h: 800 },
} as const;

/* ---------- Fixed imagery that is not part of the product catalogue ---------- */

export const sitePhotos = {
  announcementStorefront: photo("mob-storefront", 1200, 900),
  heroOfficeCasuals: photo("mob-hero-office", CROP.hero.w, CROP.hero.h),
  heroKurtaPajama: photo("mob-hero-kurta", CROP.hero.w, CROP.hero.h),
  brandStory: photo("mob-story-store", CROP.wide.w, CROP.wide.h),
  storyOpening: photo("mob-story-front", CROP.wide.w, CROP.wide.h),
  visitStoreMap: photo("mob-visit-store", CROP.wide.w, CROP.wide.h),
  interiorOne: photo("mob-interior-1", CROP.square.w, CROP.square.h),
  interiorTwo: photo("mob-interior-2", CROP.square.w, CROP.square.h),
  teamOne: photo("mob-team-1", CROP.square.w, CROP.square.h),
  teamTwo: photo("mob-team-2", CROP.square.w, CROP.square.h),
  teamThree: photo("mob-team-3", CROP.square.w, CROP.square.h),
} as const;

/** How many images the product page gallery shows. */
export const GALLERY_LENGTH = 3;