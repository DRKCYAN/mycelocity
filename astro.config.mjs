// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// The production site URL. Used for sitemap/canonical generation only.
// Local-only build in this pass; the value just needs to be a valid absolute URL.
export default defineConfig({
  site: 'https://mycelocity.com',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
