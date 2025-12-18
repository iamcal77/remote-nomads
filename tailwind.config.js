/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
         50: '#fef5f3',
          100: '#fdeae5',
          200: '#fbd5cc',
          300: '#f9c0b3',
          400: '#f69680',
          500: '#f26c4d', // A midpoint between your oranges
          600: '#e04e1a', // Your tr-primary-light
          700: '#c13d18', // Your tr-primary
          800: '#9a3114',
          900: '#7d2810',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}