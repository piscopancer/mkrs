'use client'

import { Tooltip } from '@/components/tooltip'
import { classes } from '@/utils'
import { ComponentProps } from 'react'
import { TbInfoSquareRounded } from 'react-icons/tb'

export default function Info({ ...htmlProps }: ComponentProps<'button'>) {
  return (
    <Tooltip content='Информация' sideOffset={6}>
      <button {...htmlProps} className={classes(htmlProps.className, 'text-zinc-200 py-2 px-4 rounded-full p-3 flex items-center justify-center hover:bg-zinc-800')}>
        <TbInfoSquareRounded className='h-6' />
      </button>
    </Tooltip>
  )
}
