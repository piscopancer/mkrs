'use client'

import { Example } from '@/bkrs'
import { stringToReact } from '@/utils'
import clsx from 'clsx'
import { useState } from 'react'
import Header from './header'

export default function Examples(props: React.ComponentProps<'section'> & { examples: Example[] }) {
  const { examples, ...htmlProps } = props
  const [collapsed, setCollapsed] = useState(false)

  return (
    <section {...htmlProps} className={clsx(htmlProps.className)}>
      <button onClick={() => setCollapsed((prev) => !prev)} className={clsx('w-full cursor-default text-left', collapsed ? '' : 'mb-6')}>
        <Header text='Примеры' collapsed={collapsed} />
      </button>
      <ul className={clsx('divide-y divide-zinc-800', collapsed && 'hidden')} data-search>
        {examples.map((ex, i) => {
          return (
            <li key={i} className='grid grid-cols-2 gap-x-8 py-3 max-md:block max-md:py-2'>
              <p className='self-start text-lg'>{stringToReact(ex.heading)}</p>
              <div className='text-zinc-400 max-md:mb-1'>{stringToReact(ex.innerHtml)}</div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
