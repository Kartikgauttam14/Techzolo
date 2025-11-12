/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    'autoprefixer': {},
    'cssnano': {
      preset: 'default',
    },
  },
}

export default config
