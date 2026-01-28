/** @type {import('prettier').Config} */

const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'auto',
  plugins: ['prettier-plugin-tailwindcss'],
}

export default config
