import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  vite: {
    // @ts-expect-error - Vite plugin typing issue
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
  site: 'https://lexingtonthemes.com',
  compressHTML: true
});
