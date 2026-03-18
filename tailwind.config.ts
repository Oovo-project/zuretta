import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFDF6",
          100: "#FFFBEB",
          200: "#FEF3C7",
          300: "#FFE99A",
        },
        amberglow: {
          400: "#FFCE3A",
          500: "#FFB800",
          600: "#FF8C00",
          700: "#E67300",
        },
        ink: {
          900: "#18181B",
          700: "#3F3F46",
          500: "#71717A",
          400: "#A1A1AA",
          300: "#D4D4D8",
        },
        mint: "#14B8A6",
        pink: "#F472B6",
        indigo: "#6366F1",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(255, 184, 0, 0.14), 0 2px 8px rgba(255, 140, 0, 0.08)",
        card: "0 12px 34px rgba(255, 184, 0, 0.12), 0 3px 12px rgba(255, 140, 0, 0.08)",
        button: "0 10px 22px rgba(255, 184, 0, 0.32), 0 3px 10px rgba(255, 140, 0, 0.18)",
      },
      backgroundImage: {
        "zuretta-bg":
          "linear-gradient(180deg, #FFFFFF 0%, #FFFBEB 30%, #FEF9C3 70%, #FEF3C7 100%)",
        "zuretta-card":
          "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,251,235,1) 100%)",
        "cta-gradient":
          "linear-gradient(135deg, #FF8C00 0%, #FFB800 45%, #FFCE3A 100%)",
      },
      fontFamily: {
        display: ["var(--font-plus-jakarta)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        phone: "402px",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(18px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        floatIn: "floatIn 420ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
