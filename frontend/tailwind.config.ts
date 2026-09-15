import type { Config } from "tailwindcss";

// Keep the visual language to one cool neutral palette and one blue accent.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "../backend/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111318",
        paper: "#f7f8fa",
        mist: "#e8ebf0",
        accent: "#2855ff",
        "accent-deep": "#1734b5",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 70px rgba(17, 19, 24, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

