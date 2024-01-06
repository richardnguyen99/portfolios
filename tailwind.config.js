import defaultTheme from "tailwindcss/defaultTheme";
import tailwindTypography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    "@tailwindcss/forms",
    tailwindTypography,
    "@tailwindcss/aspect-ratio",
  ],
};
