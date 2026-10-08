/**
 * ============================================================================
 *  RESPONSIVE IMAGE VARIANTS — runs automatically before `next build`
 * ============================================================================
 *  Reads the master photographs from `assets/photos/` and writes a set of
 *  width-limited copies into `public/photos/`, which is what gets deployed.
 *
 *  WHY THIS EXISTS
 *  ---------------
 *  A static export has no image-optimisation server, so `next/image` cannot
 *  resize anything. Every photograph was therefore served at its full 1200px
 *  width — a 165-346KB file — into a phone column that is about 372 CSS px
 *  wide. Lighthouse measured 2.4MB of imagery in nine requests on the home
 *  page and an LCP of 9s.
 *
 *  The fix is to do the resizing at build time instead of request time, and
 *  point `next/image` at the right copy with a custom loader
 *  (src/lib/image-loader.ts).
 *
 *  SWAPPING IN NEW PHOTOGRAPHY
 *  ---------------------------
 *  Drop the master into `assets/photos/<seed>.jpg`, exactly as before. Run
 *  `npm run build` and the variants regenerate. Nothing else to touch.
 *
 *  `assets/photos/` is the only copy that is committed. `public/photos/` is
 *  build output and is gitignored, so the 18MB of masters never ship.
 * ============================================================================
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(root, "..");
const SOURCE = path.join(projectRoot, "assets", "photos");
const OUTPUT = path.join(projectRoot, "public", "photos");

/**
 * Widths to emit, chosen from the widest place each image is actually used.
 *
 * The site is a mobile-first storefront: content is `shell` minus its inline
 * padding, so ~372 CSS px on a 412px phone and ~1544 CSS px on a desktop.
 * A 2x phone therefore needs about 744 real pixels, and a 2x desktop about
 * 3088 — which we cannot serve, so the master at 1200 is the ceiling.
 *
 * These must stay in step with `deviceSizes` / `imageSizes` in next.config.ts.
 * A width declared to Next but not generated here is a 404 in production.
 */
const WIDTHS = [200, 320, 480, 640, 800, 1024, 1200];

/** Match the quality the default Next optimiser would have produced. */
const QUALITY = 74;

async function build() {
  if (!fs.existsSync(SOURCE)) {
    console.error(
      `[images] no source directory at ${SOURCE}. Refusing to build: every ` +
        `photograph on the site would 404.`,
    );
    process.exit(1);
  }

  const masters = fs
    .readdirSync(SOURCE)
    .filter((file) => /\.(jpe?g|png)$/i.test(file))
    .sort();

  if (masters.length === 0) {
    console.error(
      "[images] assets/photos is empty. Refusing to build: every photograph " +
        "on the site would 404.",
    );
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT, { recursive: true });

  let written = 0;
  let sourceBytes = 0;
  let outputBytes = 0;
  const started = Date.now();

  for (const file of masters) {
    const stem = path.basename(file, path.extname(file));
    const input = path.join(SOURCE, file);
    sourceBytes += fs.statSync(input).size;

    const image = sharp(input, { failOn: "none" });
    const { width: sourceWidth } = await image.metadata();

    // Never upscale. A 800px master should not produce a fake 1200px copy.
    const widths = WIDTHS.filter((width) => width <= sourceWidth);

    for (const width of widths) {
      const out = path.join(OUTPUT, `${stem}@${width}.jpg`);
      await sharp(input, { failOn: "none" })
        .resize({ width, withoutEnlargement: true })
        .toFormat("jpeg", { quality: QUALITY, mozjpeg: true })
        .toFile(out);
      outputBytes += fs.statSync(out).size;
      written++;
    }
  }

  const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`;
  console.log(
    `[images] ${masters.length} masters (${mb(sourceBytes)}) -> ` +
      `${written} variants (${mb(outputBytes)}) in ${Date.now() - started}ms`,
  );
}

build().catch((error) => {
  console.error("[images] variant generation failed:", error);
  process.exit(1);
});