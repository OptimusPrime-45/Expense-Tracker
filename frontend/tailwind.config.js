/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#00ff87',
          aqua: '#00d4ff',
          purple: '#b300ff',
          pink: '#ff00ff',
        },
        dark: {
          900: '#0a0e1a',
          800: '#0f1629',
          700: '#1a1f3a',
          600: '#252d4a',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(0, 255, 135, 0.5)',
        'neon-aqua': '0 0 20px rgba(0, 212, 255, 0.5)',
        'glow': '0 0 40px rgba(0, 255, 135, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
};
