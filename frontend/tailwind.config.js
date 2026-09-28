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
          50: '#f0f6ff',
          100: '#e0edff',
          500: '#0284c7', // sky-600
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
          accent: '#0891b2', // cyan-600
          purple: '#7c3aed'  // violet-600
        },
        light: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          muted: '#64748b'
        }
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at top, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
      }
    },
  },
  plugins: [],
}
