/**
 * Flattens the RSC segment files of a static export built on Windows.
 *
 * Next names each prefetch file after its segment path with "/" swapped for
 * ".", e.g. `__next.collections.$d$slug.__PAGE__.txt`, and the browser asks
 * for exactly that name. On Windows the path it starts from uses "\", which
 * the swap misses, so the file lands in nested folders instead
 * (`__next.collections/$d$slug/__PAGE__.txt`) and every prefetch is a 404.
 *
 * This moves each nested file to the flat name Next expects. On Linux and
 * macOS, where the export is already flat, it finds nothing and does nothing.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "out");

let moved = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) flatten(full, dir, entry.name);
    else walk(full);
  }
}

/** Moves every file under `nested` to `<parent>/<prefix>.<a>.<b>.txt`. */
function flatten(nested, parent, prefix) {
  for (const entry of fs.readdirSync(nested, { withFileTypes: true })) {
    const full = path.join(nested, entry.name);
    if (entry.isDirectory()) {
      flatten(full, parent, `${prefix}.${entry.name}`);
    } else {
      fs.renameSync(full, path.join(parent, `${prefix}.${entry.name}`));
      moved++;
    }
  }
  fs.rmSync(nested, { recursive: true, force: true });
}

if (fs.existsSync(OUT)) walk(OUT);
console.log(`[export] flattened ${moved} segment files`);
