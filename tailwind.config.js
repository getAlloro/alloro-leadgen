/** Tailwind config for the audit tool. Until 2026-10-29 this lived inline in index.html for the Tailwind
 * CDN (v3.4.17, built in the visitor's browser); it is now compiled at build time with the same version and the
 * same settings (plan 10292026-audit-ui-polish, S6). The theme below is copied unchanged from that inline config. */
const inline = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
        heading: ["Spectral", "Georgia", "serif"],
      },
      colors: {
        // alloro.com palette (plan 10292026-audit-ui-polish, S1): warm greys from its ink/muted/line tokens,
        // blue -> warm ink, orange -> terracotta, yellow/amber -> its amber, green/emerald -> its green, red -> a warmer red (still "bad").
        gray: { 50: "#faf8f6", 100: "#f3f0ec", 200: "#e8e4df", 300: "#d8d3cc", 400: "#a1988f", 500: "#6b635c", 600: "#534c46", 700: "#3b3531", 800: "#26221f", 900: "#171615", 950: "#0d0c0b" },
        slate: { 50: "#faf8f6", 100: "#f3f0ec", 200: "#e8e4df", 300: "#d8d3cc", 400: "#a1988f", 500: "#6b635c", 600: "#534c46", 700: "#3b3531", 800: "#26221f", 900: "#171615", 950: "#0d0c0b" },
        blue: { 50: "#f3f0ec", 100: "#e8e4df", 200: "#d8d3cc", 300: "#b5ada5", 400: "#857c74", 500: "#3b3531", 600: "#2c2724", 700: "#231f1c", 800: "#1b1816", 900: "#171615", 950: "#0d0c0b" },
        indigo: { 50: "#f3f0ec", 100: "#e8e4df", 200: "#d8d3cc", 300: "#b5ada5", 400: "#857c74", 500: "#3b3531", 600: "#2c2724", 700: "#231f1c", 800: "#1b1816", 900: "#171615", 950: "#0d0c0b" },
        orange: { 50: "#fdf3f1", 100: "#fae4df", 200: "#f5cdc5", 300: "#eea89b", 400: "#e07a66", 500: "#c0543a", 600: "#b1462c", 700: "#9f3a28", 800: "#843325", 900: "#6d2e23", 950: "#4a1f18" },
        yellow: { 50: "#fbf6ea", 100: "#f6ecd2", 200: "#eedaa6", 300: "#e5c47a", 400: "#dfb35a", 500: "#d9a441", 600: "#b8862c", 700: "#8f6722", 800: "#6b4d1b", 900: "#4a3513", 950: "#2e210c" },
        amber: { 50: "#fbf6ea", 100: "#f6ecd2", 200: "#eedaa6", 300: "#e5c47a", 400: "#dfb35a", 500: "#d9a441", 600: "#b8862c", 700: "#8f6722", 800: "#6b4d1b", 900: "#4a3513", 950: "#2e210c" },
        green: { 50: "#eef5ef", 100: "#d9eadc", 200: "#b5d4ba", 300: "#8dba95", 400: "#6aa074", 500: "#4f8a5b", 600: "#3f7149", 700: "#335a3b", 800: "#28462e", 900: "#1d3321", 950: "#122016" },
        red: { 50: "#fcefed", 100: "#f8dcd7", 200: "#f1bab1", 300: "#e8928a", 400: "#dd6a5d", 500: "#cc4a3d", 600: "#b23b30", 700: "#922f27", 800: "#742721", 900: "#5c211c", 950: "#34110e" },
        emerald: { 50: "#eef5ef", 100: "#d9eadc", 200: "#b5d4ba", 300: "#8dba95", 400: "#6aa074", 500: "#4f8a5b", 600: "#3f7149", 700: "#335a3b", 800: "#28462e", 900: "#1d3321", 950: "#122016" },
        beige: "#fbf8f0",
        brand: {
          DEFAULT: "#d66853",
          50: "#fdf3f1",
          100: "#fae4df",
          200: "#f5cdc5",
          300: "#eea89b",
          400: "#e57c6a",
          500: "#d66853", // Primary
          600: "#bf4b36",
          700: "#9f3a28",
          800: "#843325",
          900: "#6d2e23",
        },
      },
      animation: {
        "scan-vertical": "scanVertical 3s ease-in-out infinite",
      },
      keyframes: {
        scanVertical: {
          "0%, 100%": { top: "0%" },
          "50%": { top: "100%" },
        },
      },
    },
  },
};

export default {
  content: ["./index.html", "./index.tsx", "./App.tsx", "./src/**/*.{ts,tsx}", "./utils/**/*.{ts,tsx}"],
  ...inline,
};
