import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background-rgb, 10 10 10))",
        accent: "rgb(var(--accent-rgb, 225 6 0))"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(225,6,0,0.35), 0 0 32px rgba(225,6,0,0.25)",
        soft: "0 20px 60px rgba(0,0,0,0.55)"
      },
      backdropBlur: {
        glass: "14px"
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-60%)" },
          "100%": { transform: "translateX(60%)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        shimmer: "shimmer 1.6s ease-in-out infinite",
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;

