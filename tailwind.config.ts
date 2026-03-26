import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f5f7fa",
          100: "#e9eef5",
          200: "#cfd9e6",
          300: "#a9bad0",
          400: "#7690af",
          500: "#56708d",
          600: "#425875",
          700: "#37495f",
          800: "#313d4f",
          900: "#1a2433"
        },
        mint: {
          100: "#ddfcec",
          200: "#baf7d6",
          500: "#14b86a",
          600: "#119558"
        },
        amber: {
          100: "#fff3d6",
          500: "#f4ad24",
          600: "#dc9612"
        },
        coral: {
          100: "#ffe1db",
          500: "#f06548",
          600: "#d64a2f"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },
      boxShadow: {
        panel: "0 20px 60px rgba(23, 33, 53, 0.14)",
        soft: "0 12px 40px rgba(23, 33, 53, 0.1)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(255,255,255,0.85), transparent 36%), linear-gradient(120deg, rgba(26,36,51,0.06), rgba(26,36,51,0))"
      }
    }
  },
  plugins: []
};

export default config;
