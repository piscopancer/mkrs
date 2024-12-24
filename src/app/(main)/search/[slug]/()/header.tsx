import clsx from 'clsx'
import { ComponentProps } from 'react'
import { TbChevronDown, TbChevronUp } from 'react-icons/tb'

export default function Header({ text, collapsed, ...htmlProps }: ComponentProps<'h2'> & { collapsed: boolean; text: string }) {
  const CollapsedIcon = collapsed ? TbChevronDown : TbChevronUp

  return (
    <h2 {...htmlProps} className={clsx(htmlProps.className, 'bg-halftone rounded-t-2xl border-x-2 border-t-2 border-zinc-800 py-2 font-display text-lg font-medium text-zinc-200 max-md:-mx-4 max-md:text-sm')}>
      <CollapsedIcon className={clsx('ml-3 mr-4 inline')} />
      <span className='relative'>{text}</span>
    </h2>
  )
}
