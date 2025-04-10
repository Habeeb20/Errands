/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    colors: {
    
        customPink: "#48BE24FF",
        activeColor:"#42FE7EFF"
      },
    },
  },
  plugins: [],
};
