import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from "@astrojs/sitemap";
import {defineConfig } from 'astro/config';

export default defineConfig({
  redirects: 
    { source: '/blog', destination: '/blog/' },
  vite: {
    // @ts-expect-error - Vite plugin typing issue
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
  site: 'https://rafs-portfolio.vercel.app',
  compressHTML: true
});
