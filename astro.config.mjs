// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'server',
  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['./src/components/ui/button.jsx', './src/components/ui/card.jsx']
          }
        }
      }
    }
  },

  build: {
    inlineStylesheets: 'auto'
  },

  image: {
    domains: ['images.unsplash.com'],
    formats: ['webp', 'avif']
  },

  experimental: {
    clientPrerender: true
  }
});