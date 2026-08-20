/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F5F0FF',
          100: '#EBE0FF',
          200: '#D8C2FF',
          300: '#BD94FF',
          400: '#9E61FF',
          500: '#7A35FF', // Primary Signal Violet
          600: '#6820E8',
          700: '#5415C2',
          800: '#43129B',
          900: '#38107E',
          950: '#210654',
        },
        surface: {
          mist: '#F0F2F5', // Secondary / Background Mist Gray
          light: '#F8FAFC',
          card: '#FFFFFF',
        },
        ink: {
          primary: '#0F172A',
          secondary: '#334155',
          muted: '#64748B',
          light: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
        'card': '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 12px 24px -4px rgba(122, 53, 255, 0.12), 0 4px 8px -2px rgba(15, 23, 42, 0.04)',
        'elevated': '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'brand-glow': '0 8px 20px -4px rgba(122, 53, 255, 0.35)',
      },
      borderRadius: {
        'card': '1rem',
      }
    },
  },
  plugins: [],
}
