/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    colors: {
        'e-ride-purple': '#9333EA',
        'e-ride-green': '#10B981',
        customPink: "#BE24AA",
        activeColor:"#9442FE"
      },
    },
  },
  plugins: [],
};
