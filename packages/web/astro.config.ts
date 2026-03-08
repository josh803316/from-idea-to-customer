import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Astro 5: "static" is the new default mode (replaces "hybrid").
  // SSR pages opt-in with: export const prerender = false
  output: 'static',
  adapter: vercel(),

  site: process.env.SITE_URL ?? 'https://from-idea-to-customer.vercel.app',

  integrations: [mdx(), react()],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
