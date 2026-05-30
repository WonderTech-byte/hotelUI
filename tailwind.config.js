/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6faf8',
          100: '#ccf5f1',
          200: '#99ebe3',
          300: '#66e0d5',
          400: '#33d6c7',
          500: '#00ccb9',
          600: '#00a394',
          700: '#007a6f',
          800: '#00524a',
          900: '#002925',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.14)',
        glass: '0 8px 32px rgba(31,38,135,0.15)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        'teal-gradient': 'linear-gradient(135deg, #00ccb9, #0d9488)',
        'dark-gradient': 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      }
    },
  },
  plugins: [],
}
