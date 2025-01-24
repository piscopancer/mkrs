'use client'

import clsx from 'clsx'
import { ComponentProps } from 'react'
import { TbChevronDown, TbChevronUp } from 'react-icons/tb'

export default function Header({ text, collapsed, ...props }: ComponentProps<'h2'> & { collapsed: boolean; text: string }) {
  const CollapsedIcon = collapsed ? TbChevronDown : TbChevronUp

  return (
    <h2 {...props} className={clsx(props.className, 'rounded-t-2xl border-x-2 border-t-2 border-zinc-800 py-2 font-display text-lg font-medium text-zinc-200 max-md:-mx-4 max-md:text-base')}>
      <CollapsedIcon className='ml-3 mr-4 inline size-5' />
      <span className='relative'>{text}</span>
    </h2>
  )
}
