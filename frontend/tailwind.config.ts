import type { Config } from "tailwindcss";

// Centralize the byjhor palette so every storefront surface shares the same warm yellow language.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "../backend/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#241C17",
        paper: "#FBF8F3",
        mist: "#EDE3D5",
        sand: "#EDE3D5",
        gold: "#E3AE16",
        "gold-deep": "#8F6800",
        "gold-soft": "#F5E6A9",
        "gold-pale": "#FFF5D4",
        "warm-line": "#E7DDC5",
        // Compatibility aliases keep existing account, catalog and checkout states on the new yellow system.
        accent: "#E3AE16",
        "accent-deep": "#8F6800",
        teal: "#8F6800",
        "teal-deep": "#6F4F00",
        coral: "#E3AE16",
        "coral-deep": "#B77B00",
        sun: "#E3AE16",
        "sun-deep": "#8F6800",
        blush: "#FFF5D4",
        sage: "#F5E6A9",
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
