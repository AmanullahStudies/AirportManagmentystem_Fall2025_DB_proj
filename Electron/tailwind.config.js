/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Use existing CSS variables for consistency
        primary: 'var(--mn-00)',
        secondary: 'var(--mn-01)',
        accent: 'var(--mn-02)',
        warning: 'var(--mn-06)',
        danger: 'var(--mn-08)',
        success: 'var(--mn-00)',
        
        // Text colors
        text: {
          light: 'var(--cl-00)',
          default: 'var(--cl-00)',
          muted: 'var(--cl-01)',
          subtle: 'var(--cl-02)',
        },
        
        // Background colors
        bg: {
          dark: 'var(--cl-04)',
          default: 'var(--cl-03)',
          light: 'var(--cl-02)',
          muted: 'var(--cl-01)',
        }
      },
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
