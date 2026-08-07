/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Requested primary #2563EB
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        laundry: {
          masuk: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
          dicuci: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
          disetrika: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
          selesai: { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
          diambil: { bg: '#f3e8ff', text: '#6b21a8', border: '#d8b4fe' },
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 20px 25px -5px rgba(0, 0, 0, 0.04)',
        'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.05)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};
