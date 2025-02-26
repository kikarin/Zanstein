import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Semua file di app/
    "./components/**/*.{js,ts,jsx,tsx}", // Semua komponen di components/
    "./pages/**/*.{js,ts,jsx,tsx}", // Jika pakai pages router
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4E95E5",
      },
      fontFamily: {
        sans: ["GOTO Sans", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
