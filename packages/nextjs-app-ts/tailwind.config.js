module.exports = {
  content: ['./src/pages/**/*.{vue,js,ts,jsx,tsx}', './src/components/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  mode:'jit',
  important: false,
  theme: {
    fontFamily:{
      'display': ['Montserrat'],
      'body': ['Open Sans']
    },
    colors: {
      yellow: {
        DEFAULT: '#F9E978'
      },
      gray: {
        DEFAULT:'#D9D9D9'
      },
      brown: {
        light: '#A49A81',
        DEFAULT: '#A49A81',
        dark: '#37271F'
      },
      white: {
        DEFAULT: '#FEFDF7'
      },
    },
    extend: {
      extend: {
        /**
         *  added the default spacing values to max width
         * @param theme
         */
        maxWidth: (theme) => ({
          ...theme('spacing'),
        }),
        minWidth: (theme) => ({
          ...theme('spacing'),
        }),
        backgroundColor: ['group-focus'],
        borderWidth: {
          1: '1px',
        },
      },
    },
  },
  variants: {
    extend: {
      // ...
      borderWidth: ['hover', 'focus'],
    },
  }
};
