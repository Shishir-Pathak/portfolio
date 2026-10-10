/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      keyframes: {
        float: { '50%': { transform: 'translateY(-24px)' } },
        shift: { to: { backgroundPosition: '200%' } },
      },
      animation: { float: 'float 8s ease-in-out infinite', shift: 'shift 6s linear infinite' },
    },
  },
  plugins: [],
};
