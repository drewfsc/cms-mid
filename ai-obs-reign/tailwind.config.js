/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'rotate': 'rotate 3s linear infinite',
        'percent': 'percent 2s ease-in-out infinite',
      },
      keyframes: {
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        percent: {
          '0%': { content: '"0%"' },
          '25%': { content: '"25%"' },
          '33%': { content: '"33%"' },
          '42%': { content: '"42%"' },
          '51%': { content: '"51%"' },
          '67%': { content: '"67%"' },
          '74%': { content: '"74%"' },
          '75%': { content: '"75%"' },
          '86%': { content: '"86%"' },
          '95%': { content: '"95%"' },
          '98%': { content: '"98%"' },
          '99%': { content: '"99%"' },
        },
      },
      width: {
        '76': '19rem',
      },
    },
  },
  plugins: [],
}

