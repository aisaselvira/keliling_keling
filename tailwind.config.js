/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
      'fade-in-up': {
        '0%': {
          opacity: '0',
          transform: 'translateY(20px)',
        },
        '100%': {
          opacity: '1',
          transform: 'translateY(0)',
        },
      },
    },
      colors: {
        primary: "#2563eb",
        grey: "#f9f9fb",
        dark: "#141414",
        darklight: "#000f30",
        midnight_text: "#102d47",
      },
      animation: {
      'fade-in-up': 'fade-in-up 0.5s ease-out',
    },
      fontSize: {
        22: "1.375rem",
        28: "1.75rem",
        32: "2rem",
        36: "2.25rem",
        40: "2.5rem",
        65: "4.063rem",
      },
      spacing: {
        17: "4.375rem",
        50: "50rem",
        "9_375": "9.375rem",
        "1_875": "1.875rem",
      },
    },
  },
  plugins: [],
};
