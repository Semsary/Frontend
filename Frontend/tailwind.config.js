/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "spin-slow": "spin 2s linear infinite",
        "spin-fast": "spin 1s linear infinite",
        "fade-in": "fadeIn 1.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      colors: {
        primary: "#3f5845",
        primary2: "#4f8960",
        secondary: "#D33F49",
        secondary2: "#ab343c",
      },
      transitionDuration: {
        2000: "5000ms",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),

    function ({ addBase }) {
      addBase({
        "::selection": {
          backgroundColor: "#3f5845 !important", // Use !important for higher specificity
          color: "#ffffff !important", // Use !important for higher specificity
        },
      });
    },
  ],
};
