'use client'

import { Tooltip } from '@/components/tooltip'
import { classes } from '@/utils'
import { ComponentProps } from 'react'
import { TbSun } from 'react-icons/tb'

export default function ThemeSwitch({ ...htmlProps }: ComponentProps<'button'>) {
  return (
    <Tooltip content='Сменить тему' sideOffset={6}>
      <button {...htmlProps} className={classes(htmlProps.className, 'text-zinc-200 py-2 px-4 rounded-full p-3 flex items-center justify-center hover:bg-zinc-800')}>
        <TbSun className='h-6' />
      </button>
    </Tooltip>
  )
}
