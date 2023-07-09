import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: "'Inter', sans-serif",
        bg: "#161926",
        display: "flex",
        lineHeight: 1.75,
      }
    }
  },
  colors: {
    red: {
      td: "#C7323A", /* TD red */
    },
    off_primary: "#444658",
    primary: "#ffffff",
    secondary: "#f8d2cc"
  },
  components: {
      Button: {
        baseStyle: {
            border: "1px solid",
            textTransform: "uppercase",
            fontWeight: "700",
        },
        defaultProps: {
            variant: "primary",
        },
        variants: {
            primary: {
                color: "primary",
                borderColor: "off_primary",
                
                _hover: {
                    background: "off_primary"
                }
            },
            secondary: {
                color: "secondary",
                borderColor: "secondary",

                _hover: {
                    color: "black",
                    background: "secondary",
                }
            }
        },
        sizes: {
            sm: {
                fontSize: ".8rem"
            }
        }
    }
  }
}, { config })

export default theme