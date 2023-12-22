import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

/* Theme customization for ChakraUI */
const theme = extendTheme(
  {
    styles: {
      global: {
        body: {
          fontFamily: "'Inter', sans-serif",
          bg: 'slate.800',
          display: 'flex',
          lineHeight: 1.75,
        },
      },
    },
    colors: {
      red: {
        td: '#C7323A' /* TD red */,
      },
      primary: '#ffffff',
      slate: {
        500: '#444658',
        600: '#2b2c3d',
        700: '#222136',
        800: '#161926',
      },
      secondary: '#f8d2cc',
      inputBackground: '#272530',
      inputBorder: '#2f2c45',
    },
    components: {
      Button: {
        baseStyle: {
          border: '1px solid',
          textTransform: 'uppercase',
          fontWeight: '700',
        },
        defaultProps: {
          variant: 'primary',
        },
        variants: {
          primary: {
            color: 'primary',
            borderColor: 'slate.500',

            _hover: {
              background: 'slate.500',
            },
          },
          secondary: {
            color: 'secondary',
            borderColor: 'secondary',

            _hover: {
              color: 'black',
              background: 'secondary',
            },
          },
        },
        sizes: {
          sm: {
            fontSize: '.8rem',
          },
        },
      },
      Link: {
        defaultProps: {
          variant: 'primary',
        },
        variants: {
          primary: {
            color: 'blue.400',
          },
          secondary: {
            color: 'secondary',
          },
        },
      },
    },
  },
  { config }
);

export default theme;
