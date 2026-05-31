/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Clash Display', 'sans-serif'],
        sans: ['var(--font-sans)', 'DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#7967FF',
          light: '#F0EEFF',
          mid: '#C4BCFF',
          dark: '#6654F0',
        },
      },
      spacing: {
        13: '3.25rem',
      },
    },
  },
}
