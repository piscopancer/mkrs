import { fonts } from '@/assets/fonts'
import { project } from '@/project'
import type { Metadata } from 'next'
import '@/assets/styles/style.scss'
import { classes } from '@/utils'

export const metadata: Metadata = {
  title: project.name,
  description: project.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ru'>
      <body className={classes(fonts.sans, 'text-zinc-400 bg-zinc-900 max-w-screen-lg mx-auto max-lg:mx-6')}>{children}</body>
    </html>
  )
}
