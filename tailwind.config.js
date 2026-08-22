import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "drop-1": "0px 10px 30px 0px rgba(22, 34, 51, 0.08)",
        "drop-2": "0px 10px 30px 0px rgba(66, 71, 97, 0.20)", // Classe shadow-drop-2 resolvida
        "drop-3": "0px 10px 30px 0px rgba(66, 71, 97, 0.30)",
      },
      colors: {
        brand: {
          DEFAULT: "#fa7275",
          100: "#ea6365",
        },
        red: "#ff7474",
        error: "#b80000",
        green: "#3dd9b3",
        blue: "#56b8ff",
        pink: "#eea8fd",
        orange: "#f9ab72",
        light: {
          100: "#333f4e",
          200: "#a3b2c7",
          300: "#f2f5f9",
          400: "#f2f4f8",
        },
        dark: {
          100: "#04050c",
          200: "#131524",
        },
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
