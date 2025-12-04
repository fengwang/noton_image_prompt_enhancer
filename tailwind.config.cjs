/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,jsx,js}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "Manrope", "system-ui", "sans-serif"],
        body: ["Manrope", "Space Grotesk", "system-ui", "sans-serif"]
      },
      colors: {
        surface: "#0b1021",
        card: "rgba(255,255,255,0.06)",
        stroke: "rgba(255,255,255,0.12)",
        accent1: "#7c5dff",
        accent2: "#1ec8ff"
      },
      boxShadow: {
        glow: "0 15px 50px rgba(124, 93, 255, 0.2)",
        card: "0 18px 44px rgba(7, 10, 18, 0.45)"
      },
      backdropBlur: {
        xs: "2px"
      }
    }
  },
  plugins: []
};
