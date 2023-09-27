/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Outfit': ['Outfit']
      },
      colors: {
        'title': '#991aff',
        'titlechange': '#774a5f',
        'navbg2': '#447988',
      },
      backgroundImage: {
        'global-gradient': 'linear-gradient(32deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 64%, rgba(26,26,26,1) 86%, rgba(0,0,0,1) 100%)',
      },
    },
  },
  plugins: [],
}
