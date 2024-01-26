import { classes } from '@/utils'
import { ComponentProps } from 'react'

export default function Heading({ text, ...htmlProps }: ComponentProps<'h2'> & { text: string }) {
  return (
    <h2 {...htmlProps} className={classes(htmlProps.className, 'font-display uppercase text-zinc-200 text-sm max-md:text-xs sticky top-0 bg-zinc-900 py-2')}>
      <span className='h-[2px] bg-gradient-to-r from-zinc-800 to-transparent absolute inset-x-0 top-1/2' />
      <span className='relative'>{text}</span>
    </h2>
  )
}
