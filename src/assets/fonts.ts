import { Roboto_Mono, Sofia_Sans } from 'next/font/google'

const _sofiaSans = Sofia_Sans({ subsets: ['latin', 'cyrillic'] })
const _robotoMono = Roboto_Mono({ subsets: ['cyrillic', 'latin'] })

export const fonts = {
  sans: _sofiaSans.className,
  mono: _robotoMono.className,
}
