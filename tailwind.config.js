/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'instrument-sans': ['Instrument Sans', 'sans-serif'],
      },
      colors: {
        'meridian-gold': '#e1c16e',
        'meridian-blue': '#131f5b',
      },
    },
  },
  plugins: [],
}