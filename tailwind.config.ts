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
  },
  plugins: [
    plugin(({ addComponents }) => {
      addComponents({
        '.hopper': {
          display: 'grid',
          gridTemplateAreas: '"hopper"',
          '& > *': {
            gridArea: 'hopper',
          },
        },
      })
    }),
  ],
}
export default config
