/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e3a8a",
          900: "#172554"
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a"
        },
        success: {
          100: "#dcfce7",
          200: "#bbf7d0",
          500: "#22c55e",
          600: "#16a34a"
        },
        warning: {
          100: "#fef9c3",
          500: "#facc15",
          600: "#ca8a04"
        },
        danger: {
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },
      boxShadow: {
        panel: "0 28px 70px rgba(15, 23, 42, 0.12)",
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)",
        glow: "0 18px 38px rgba(37, 99, 235, 0.18)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(255,255,255,0.95), transparent 34%), linear-gradient(135deg, rgba(37,99,235,0.18), rgba(30,58,138,0.08))",
        "dashboard-grid":
          "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

module.exports = config;
