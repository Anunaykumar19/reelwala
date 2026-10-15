import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        purple: "#7C3AED",
        pink: "#EC4899",
        orange: "#F97316",
        cyan: "#22D3EE",
        lime: "#A3E635",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["clamp(2.75rem, 6.2vw, 6.5rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        h1: ["clamp(2.25rem, 5vw, 4.5rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        h2: ["clamp(1.75rem, 3.5vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h3: ["clamp(1.25rem, 2vw, 1.75rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      backgroundImage: {
        brand: "linear-gradient(100deg, #7C3AED 0%, #EC4899 50%, #F97316 100%)",
        "brand-soft": "linear-gradient(100deg, rgba(124,58,237,.25), rgba(236,72,153,.25), rgba(249,115,22,.25))",
        shimmer: "linear-gradient(110deg, transparent 20%, rgba(255,255,255,.35) 50%, transparent 80%)",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(236,72,153,.55), 0 0 80px -20px rgba(124,58,237,.6)",
        "glow-sm": "0 0 20px -6px rgba(236,72,153,.5)",
        card: "0 20px 60px -20px rgba(0,0,0,.6)",
      },
      borderRadius: { "2xl": "1.25rem", "3xl": "1.75rem", "4xl": "2.5rem" },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        "pulse-ring": { "0%": { transform: "scale(1)", opacity: ".8" }, "100%": { transform: "scale(1.9)", opacity: "0" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        blob: { "0%,100%": { transform: "translate(0,0) scale(1)" }, "33%": { transform: "translate(40px,-60px) scale(1.1)" }, "66%": { transform: "translate(-30px,30px) scale(.95)" } },
        grain: { "0%,100%": { transform: "translate(0,0)" }, "10%": { transform: "translate(-5%,-10%)" }, "30%": { transform: "translate(3%,-15%)" }, "50%": { transform: "translate(12%,9%)" }, "70%": { transform: "translate(9%,4%)" }, "90%": { transform: "translate(-1%,7%)" } },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        shimmer: "shimmer 2.2s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(.2,.6,.2,1) infinite",
        "spin-slow": "spin-slow 12s linear infinite",
        blob: "blob 18s ease-in-out infinite",
        grain: "grain 8s steps(10) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
