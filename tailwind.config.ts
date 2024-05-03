import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import { ThemeConfig } from 'tailwindcss/types/config'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    fontFamily: {
      sans: 'var(--font-sans)',
      display: 'var(--font-display)',
      mono: 'var(--font-mono)',
    },
  },
  plugins: [
    plugin(({ addComponents, matchUtilities, theme }) => {
      addComponents({
        '.hopper': {
          display: 'grid',
          gridTemplateAreas: '"hopper"',
          '& > *': {
            gridArea: 'hopper',
          },
        },
      }),
        matchUtilities(
          {
            hole: (value) => ({
              clipPath: `polygon(
            0 0,
            100% 0,
            100% 100%,
            0 100%,
            0 0,
            ${value} 0,
            ${value} calc(100% - ${value}),
            calc(100% - ${value}) calc(100% - ${value}),
            calc(100% - ${value}) ${value},
            0 ${value}
          );`,
            }),
          },
          { values: theme('height' as keyof ThemeConfig) },
        )
    }),
  ],
}
export default config
