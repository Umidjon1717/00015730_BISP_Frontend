/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins", sans-serif'],
        "poppins-bold": ['"Poppins Bold", sans-serif'],
        montserrat: ['"Montserrat", sans-serif'],
        "poppins-light": ['"Poppins Light", sans-serif'],
      },
      colors: {
        "bg-primary": "#B88E2F",
      },
      backgroundImage: {
        "hero-image": 'url("/assets/hero_home.png")',
        "main-hero-image": 'url("/assets/hero_main.png")',
      },
    },
    container: {
      center: true,
      screens: {
        sm: "600px",
        md: "728px",
        lg: "984px",
        xl: "1240px",
        "2xl": "1286px",
      },
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        lg: "0",
        xl: "0",
        "2xl": "0",
      },
    },
  },
  plugins: [],
};
