import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['Lobster', 'cursive'],
        sans: ['GmarketSans', 'sans-serif'],
        clan: ['var(--font-clan)', 'sans-serif'],
        sl: ['var(--font-sl)', 'sans-serif'],
        noto: ['var(--font-noto)', 'sans-serif'],
      },
      colors: {
        'half-red': '#e06c75',
        'half-green': '#98c379',
        'half-yellow': '#e5c07b',
        'half-blue': '#61afef',
        'half-purple': '#c678dd',
        'half-cyan': '#56b6c2',
        'half-white': '#dcdfe4',
        'half-black': '#282c34',
      }
    },
  },
  plugins: [],
};
export default config;
