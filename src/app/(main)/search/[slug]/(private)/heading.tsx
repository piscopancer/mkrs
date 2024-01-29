import { classes } from '@/utils'
import { ComponentProps } from 'react'

export default function Heading({ text, ...htmlProps }: ComponentProps<'h2'> & { text: string }) {
  return (
    <h2 {...htmlProps} className={classes(htmlProps.className, 'sticky top-0 bg-zinc-900 py-2 font-display text-sm uppercase text-zinc-200 max-md:text-sm')}>
      <span className='absolute inset-x-0 top-1/2 h-[2px] bg-gradient-to-r from-zinc-800 to-transparent' />
      <span className='relative'>{text}</span>
    </h2>
  )
}
