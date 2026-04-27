import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        olive: {
          50: "#f5f7ee",
          100: "#e7ecd4",
          200: "#cfd9aa",
          300: "#b1c178",
          400: "#94a851",
          500: "#778d3a",
          600: "#5b6f2c",
          700: "#475724",
          800: "#3a4720",
          900: "#2f3a1d",
          950: "#181f0c",
        },
        sand: {
          50: "#fbf9f4",
          100: "#f4efe1",
          200: "#e8debf",
          300: "#d9c896",
          400: "#c8ae6c",
          500: "#bb9750",
          600: "#a47d40",
          700: "#866236",
          800: "#6e5031",
          900: "#5b432b",
        },
        carmine: {
          500: "#c0392b",
          600: "#a83025",
          700: "#8b271e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-cairo)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "drift": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "pulse-dot": {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s ease-out both",
        "drift": "drift 6s ease-in-out infinite",
        "shimmer": "shimmer 1.4s linear infinite",
        "pulse-dot": "pulse-dot 1.2s ease-in-out infinite",
      },
      backgroundImage: {
        "tatreez-light":
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><g fill='none' stroke='%235b6f2c' stroke-opacity='0.18' stroke-width='1'><path d='M20 0 L24 8 L32 8 L26 14 L28 22 L20 18 L12 22 L14 14 L8 8 L16 8 Z'/></g></svg>\")",
        "tatreez-dark":
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><g fill='none' stroke='%23b1c178' stroke-opacity='0.12' stroke-width='1'><path d='M20 0 L24 8 L32 8 L26 14 L28 22 L20 18 L12 22 L14 14 L8 8 L16 8 Z'/></g></svg>\")",
      },
    },
  },
  plugins: [],
};

export default config;
