import { Dela_Gothic_One, Roboto_Mono, Sofia_Sans, Wix_Madefor_Text } from 'next/font/google'

// Dela gothic one
// Wix Madefor Display

const _dela = Dela_Gothic_One({ subsets: ['latin', 'cyrillic'], weight: ['400'] })
const _wix = Wix_Madefor_Text({ subsets: ['latin', 'cyrillic'] })
const _robotoMono = Roboto_Mono({ subsets: ['cyrillic', 'latin'] })

export const fonts = {
  sans: _wix.className,
  display: _dela.className,
  mono: _robotoMono.className,
}
