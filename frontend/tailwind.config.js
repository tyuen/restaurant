/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "2xs": "0.6rem",
      },
      animation: {
        zoom: "zoom 0.3s",
      },
      keyframes: {
        zoom: {
          "0%": { transform: "scale(0.5)" },
        },
      },
    },
  },
  plugins: [],
};
