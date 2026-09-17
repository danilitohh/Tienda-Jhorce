import type { Config } from "tailwindcss";

// Centralize the byjhor palette so every storefront surface shares the same visual language.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "../backend/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#241C17",
        paper: "#FBF8F3",
        mist: "#EDE3D5",
        sand: "#EDE3D5",
        accent: "#DDA210",
        "accent-deep": "#8A6500",
        teal: "#006B67",
        "teal-deep": "#00504D",
        coral: "#E35D47",
        "coral-deep": "#B84132",
        sun: "#F4BF3C",
        "sun-deep": "#D99B16",
        blush: "#F4D4CF",
        sage: "#D8E6DD",
        muted: "#74685E",
        success: "#2F6B48",
        danger: "#B9382F",
        warning: "#916C0F",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
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
