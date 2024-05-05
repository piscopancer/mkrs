import cqPlugin from '@tailwindcss/container-queries'
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    fontFamily: {
      sans: 'var(--font-sans)',
      display: 'var(--font-display)',
      mono: 'var(--font-mono)',
    },
    boxShadow: ({ theme }) => ({
      key: `0 1px 0 2px ${theme('colors.zinc.700')}`,
    }),
  },
  plugins: [
    cqPlugin,
    plugin(({ addComponents, matchVariant }) => {
      addComponents({
        '.hopper': {
          display: 'grid',
          gridTemplateAreas: '"hopper"',
          '& > *': {
            gridArea: 'hopper',
          },
        },
      }),
        matchVariant('not', (v) => `&:not(${v})`)
    }),
  ],
}
export default config
