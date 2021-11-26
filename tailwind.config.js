module.exports = {
  mode: 'jit',
  purge: {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    safelist: [
      'sm:col-span-1',
      'sm:col-span-2',
      'md:col-span-1',
      'md:col-span-2',
      'lg:col-span-1',
      'lg:col-span-2',
      'sm:row-span-1',
      'sm:row-span-2',
      'md:row-span-1',
      'md:row-span-2',
      'lg:row-span-1',
      'lg:row-span-2',
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: "Montserrat, Helvetica, Arial, sans-serif"
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
}
