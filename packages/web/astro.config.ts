import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // "hybrid" mode: all pages SSG by default.
  // Mark specific pages SSR with: export const prerender = false
  output: 'hybrid',
  adapter: vercel(),

  site: process.env.SITE_URL ?? 'https://fromideatocustomer.com',

  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    react(),
  ],

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
