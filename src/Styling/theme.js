import { extendTheme } from '@chakra-ui/react'
import { theme as baseTheme } from '@saas-ui/react'
import { theme as glassTheme } from '@saas-ui/theme-glass'

export const theme = extendTheme(
  {
    Text: {
      baseStyle: {
        fontFamily: 'Inter',
        fontWeight: '400',
        fontSize: '14px',
        lineHeight: '20px',
      },
    },
  },
  glassTheme,
  baseTheme
)