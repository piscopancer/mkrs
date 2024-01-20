import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    fontFamily: {
      sans: 'var(--font-sans)',
      display: 'var(--font-display)',
      mono: 'var(--font-mono)',
    },
  },
}
export default config
