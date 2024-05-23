import { extendTheme } from '@chakra-ui/react'
import { theme as baseTheme } from '@saas-ui/react'
import { theme as glassTheme } from '@saas-ui/theme-glass'

export const theme = extendTheme(
  {
    // your overrides
  },
  glassTheme,
  baseTheme
)