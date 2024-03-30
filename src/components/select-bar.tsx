'use client'

import type { TComponent } from '@/utils'
import clsx from 'clsx'
import type { ReactNode } from 'react'

type SelectBar<O extends unknown> = {
  options: O[]
  display: (option: O) => ReactNode
  onSelect: (option: O) => Promise<void> | void
  selected: (option: O) => boolean
}

export default function SelectBar<O extends unknown>({ props, ...attr }: TComponent<'div', SelectBar<O>>) {
  return (
    <div {...attr} className={clsx(attr.className, 'relative')}>
      <ul className='flex justify-between rounded-full bg-zinc-900 p-1'>
        {props.options.map((o, i) => (
          <li key={i} className={clsx('size-3 rounded-full duration-100', props.selected(o) ? 'scale-110 bg-zinc-300' : 'bg-zinc-600')}></li>
        ))}
      </ul>
      <menu className='absolute -inset-4 flex justify-stretch'>
        {props.options.map((o, i) => (
          <li key={i} className='grow'>
            <button onClick={async () => await props.onSelect(o)} className='size-full'></button>
          </li>
        ))}
      </menu>
    </div>
  )
}
