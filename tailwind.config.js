module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        's': '4px 1px 17px rgba(253, 252, 252, 0.05)',
        'brown-s': '0 0 20px rgba(158, 009, 004, 1)'
      },
      colors: {
        'white': '#fff',
        'darkgray': '#1d1d1b',
        'yellow': '#f8de44',
        'yellow2': '#eb8a06',
        'brown': '#9e0904',
        'brown2': '#d15904',
        'yellow3': '#f6bc25',
        'pink': '#fd644f',
        'pink-2' : "#fb5988",
        'melon': '#f28e26',
        'hotpink': '#ff0f47',
        'lightpink': '#ffab96',
        'blue': '#3c65aa',
        'purple': '#c6379c',
        "yellow4": '#f5bc25',
        "orange": "#f9650b"
      },
      borderRadius: {
        'xlarge': '15px',
      },
      backgroundImage: {
        'hero-rocket': "url('./assets/img/Rocket.png')"
      },
      backgroundSize: {
        '40': '40%'
      }
    }
  },
  plugins: [],
}
