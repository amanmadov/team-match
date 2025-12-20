/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'uefa-blue': '#0e1e3e',
        'uefa-blue-light': '#1a2f54',
        'uefa-blue-dark': '#070f1f',
        'uefa-cyan': '#00d4ff',
        'uefa-teal': '#00b8d4',
        'pitch-green': '#2d5a3d',
        'pitch-dark': '#1a3326',
        'pitch-light': '#3d7a52',
        'line-white': '#f0f0f0',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
