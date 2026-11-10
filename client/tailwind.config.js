/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#34B34C",
        secondary: "#0B4A2D",
        third: "#E6F1D1",
      },
    },
  },
  plugins: [],
};
