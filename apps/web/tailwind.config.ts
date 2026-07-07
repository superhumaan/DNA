import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dna: {
          bg: "#07080c",
          surface: "#0f1118",
          border: "#1e2433",
          muted: "#8b95a8",
          text: "#e8ecf4",
          accent: "#4ade9a",
          accentDim: "#2a9d6a",
          glow: "#4ade9a33",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
