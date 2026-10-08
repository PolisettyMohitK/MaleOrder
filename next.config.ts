import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /* Static export. This site has no server code — no route handlers, no
     middleware, no server actions, no cookies or headers — and every route is
     prerendered from local JSON, so there is nothing a runtime would do.
     Exporting avoids the Workers/OpenNext adapter entirely. */
  output: "export",

  /* Emit route/index.html rather than route.html. Cloudflare Pages serves
     directory indexes most reliably, so this is the safe pairing. */
  trailingSlash: true,

  /* cacheComponents (and its partialPrefetching companion) are deliberately
     NOT set. Cache Components turns on Partial Prerendering, and Next refuses
     the combination outright: "Invariant: PPR cannot be enabled in export
     mode".

     Nothing here needs it. There is no `use cache`, no Suspense boundary and
     no dynamic API anywhere in the app — the catalogue is local JSON and every
     route already prerenders, so PPR had nothing to defer. If a server feature
     is ever added (a real stock API, say), drop `output: export` and deploy to
     Workers with the OpenNext adapter instead, which does support PPR. */

  images: {
    /* There is no image optimisation server behind a static export. Every
       photograph is a local file in /public, already exported at the sizes
       noted in src/lib/images.ts, so next/image passes them through as-is. */
    unoptimized: true,
  },

  turbopack: {
    // There is an unrelated package.json in the parent directory, which
    // otherwise makes Turbopack treat the whole home folder as the workspace.
    root: projectRoot,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;