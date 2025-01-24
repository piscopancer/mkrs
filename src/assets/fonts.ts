import clsx from 'clsx'
import { GeistMono } from 'geist/font/mono'
import { Montserrat, Wix_Madefor_Text } from 'next/font/google'

const sans = Wix_Madefor_Text({ subsets: ['latin', 'cyrillic'], variable: '--font-sans', display: 'swap' })
// const display = Prosto_One({ subsets: ['cyrillic', 'latin'], weight: ['400'], variable: '--font-display', display: 'swap' })
const display = Montserrat({ subsets: ['cyrillic', 'latin'], variable: '--font-display', display: 'swap' })

export const fontsVars = clsx(sans.variable, display.variable, GeistMono.variable)
