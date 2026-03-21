import { createContext, use } from 'react'
import type { ChatTheme, ColorMode } from '@/types/theme'

export interface ThemeContextValue {
  theme: ChatTheme
  colorMode: ColorMode
  accentColor: string
  accentTextColor: string
}

export const ThemeContext = createContext<ThemeContextValue>(null!)

export function useTheme(): ThemeContextValue {
  return use(ThemeContext)
}
