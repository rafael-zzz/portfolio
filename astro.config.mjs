import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import preact from "@astrojs/preact";
import remarkCallouts from "./src/features/writing/lib/remarkCallouts.mjs";

const site = "https://rafs-portfolio.vercel.app";
const excludedSitemapPages = new Set([`${site}/`, `${site}/blog/`, `${site}/introduction/`]);
const legacyLocalizedWritingPattern =
  /^https:\/\/rafs-portfolio\.vercel\.app\/(en|pt|de|es)\/(?!writing\/|projects\/)[^/]+\/$/;

export default defineConfig({
  redirects: {
    "/blog": "/en/writing/",
  },
  markdown: {
    gfm: true,
    remarkPlugins: [remarkCallouts],
  },
  vite: {
    // @ts-expect-error - Vite plugin typing issue
    plugins: [tailwindcss()],
  },
  integrations: [
    preact(),
    sitemap({
      filter: (page) =>
        !excludedSitemapPages.has(page) && !legacyLocalizedWritingPattern.test(page),
    }),
  ],
  site,
  compressHTML: true,
});
