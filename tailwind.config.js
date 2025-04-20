import { theme } from 'antd';
import { ThemeConfig } from 'antd/lib/config-provider';

const { defaultAlgorithm, darkAlgorithm } = theme;

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005c4e', 
          50: '#e8f5f3',
          100: '#d1ebe7',
          200: '#a3d7cf',
          300: '#75c3b7',
          400: '#47af9f',
          500: '#1a9b87',
          600: '#187c6c',
          700: '#165d51',
          800: '#133e36',
          900: '#0f1f1b',
        },
        secondary: {
          DEFAULT: '#f8f9fa',
          dark: '#151515',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}