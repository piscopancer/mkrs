import clsx from 'clsx'
import { ComponentProps } from 'react'

export default function Header({ text, ...htmlProps }: ComponentProps<'h2'> & { text: string }) {
  return (
    <h2 {...htmlProps} className={clsx(htmlProps.className, 'py-2 font-display text-lg font-medium text-zinc-200 max-md:text-sm')}>
      <span className='mr-2 text-zinc-700'>#</span>
      <span className='relative'>{text}</span>
    </h2>
  )
}
