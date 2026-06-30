/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          blue: {
            light: '#e6f0ff',
            DEFAULT: '#004bcf',
            hover: '#003eb3',
            dark: '#002561',
            text: '#0039a6',
          },
          cyan: '#38bdf8',
          bgGradStart: '#002c8c',
          bgGradEnd: '#001a54',
          textMuted: '#6b7280',
          textDark: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}

