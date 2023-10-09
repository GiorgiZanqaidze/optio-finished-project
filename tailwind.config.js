/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px', // Small screen
        'md': '1200px', // Medium screen
        'lg': '1024px', // Large screen
      },
      colors: {
        primary: '#ff5733',
        secondary: '#3498db',
        accent: '#f39c12',
      },
    },
  },
  plugins: [],
}

