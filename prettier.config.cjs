// https://prettier.io/docs/en/options.html
/** @type {import('prettier').RequiredOptions} */
module.exports = {
  arrowParens: 'avoid',
  bracketSpacing: true,
  jsxSingleQuote: true,
  printWidth: 100,
  proseWrap: 'always',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss']
}
