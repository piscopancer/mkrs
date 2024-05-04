import clsx from 'clsx'
import { Dela_Gothic_One, JetBrains_Mono, Wix_Madefor_Text } from 'next/font/google'

const _wix = Wix_Madefor_Text({ subsets: ['latin', 'cyrillic'], variable: '--font-sans', display: 'swap' })
const _dela = Dela_Gothic_One({ subsets: ['latin', 'cyrillic'], weight: ['400'], variable: '--font-display', display: 'swap' })
const _jetbrainsMono = JetBrains_Mono({ subsets: ['cyrillic', 'latin'], variable: '--font-mono', display: 'swap' })

export const fontsVars = clsx(_wix.variable, _dela.variable, _jetbrainsMono.variable)
