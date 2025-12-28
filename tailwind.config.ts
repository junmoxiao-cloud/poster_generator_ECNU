import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        club: {
          primary: '#6366f1',
          secondary: '#a855f7',
          accent: '#f472b6',
          dark: '#1e1b4b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'club-gradient': 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #f472b6 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
