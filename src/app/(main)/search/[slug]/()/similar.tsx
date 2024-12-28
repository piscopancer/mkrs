'use client'

import { type Similar } from '@/bkrs'
import clsx from 'clsx'
import { useState } from 'react'
import ChLink from './ch-link'
import Header from './header'

export default function Similar({ similar, ...htmlProps }: React.ComponentProps<'section'> & { similar: Similar[] }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <section {...htmlProps} className={clsx(htmlProps.className)}>
      <button onClick={() => setCollapsed((prev) => !prev)} className={clsx('w-full cursor-default text-left', collapsed ? '' : 'mb-6')}>
        <Header text='Похожие' collapsed={collapsed} />
      </button>
      <ul className={clsx('grid grid-cols-3 max-md:flex max-md:flex-col max-md:gap-1', collapsed && 'hidden max-md:hidden')} data-search>
        {similar.map((similar, i) => (
          <li key={i}>
            <ChLink search={similar.search} />
          </li>
        ))}
      </ul>
    </section>
  )
}
