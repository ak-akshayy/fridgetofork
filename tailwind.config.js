/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#112920',
          800: '#18382D', // Deep Green
          700: '#244B3A', // Primary Forest Green
          600: '#2E5E49',
          500: '#3D7A60',
          100: '#E7EFEA',
          50: '#F3F7F5',
        },
        sage: {
          50: '#F7F9F5',
          100: '#EEF3EA',
          200: '#DDE6D5',
          300: '#C5D6B8',
          400: '#A8B99A', // Sage Green
          500: '#8DA27D',
          600: '#6E825F',
        },
        cream: {
          50: '#FCFBF8',
          100: '#F8F7F1', // Cream Background
          200: '#F0EDE2',
          300: '#E5E0CE',
        },
        coral: {
          50: '#FDF4F1',
          100: '#FCE7E2',
          400: '#F1A58C',
          500: '#E88D70', // Coral Accent
          600: '#D27051',
          700: '#B05336',
        },
        softYellow: {
          DEFAULT: '#F2D58A', // Soft Yellow
          100: '#FDF9EC',
          200: '#F8EECB',
          300: '#F2D58A',
          400: '#E5BF60',
        },
        textDark: '#242D27', // Text Dark
        textMuted: '#788078', // Secondary Text
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(36, 75, 58, 0.07), 0 4px 6px -2px rgba(36, 75, 58, 0.04)',
        'soft-lg': '0 10px 25px -3px rgba(36, 75, 58, 0.1), 0 4px 12px -2px rgba(36, 75, 58, 0.05)',
        'card-hover': '0 14px 30px -4px rgba(36, 75, 58, 0.14), 0 4px 12px -2px rgba(36, 75, 58, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
