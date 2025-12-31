/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0B0C0E',
          secondary: '#1A1D23',
          tertiary: '#2E333B',
        },
        accent: {
          gold: '#C9A961',
        },
        severity: {
          critical: '#DC2626',
          concern: '#EAB308',
          watch: '#3B82F6',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
          tertiary: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
    },
  },
  plugins: [],
}
