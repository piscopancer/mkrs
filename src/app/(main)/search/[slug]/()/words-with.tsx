'use client'

import clsx from 'clsx'
import { ComponentProps, useState } from 'react'
import ChLink from './ch-link'
import Header from './header'

export default function WordsWith({ words, ...htmlProps }: ComponentProps<'section'> & { words: string[] }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <section {...htmlProps} className={clsx(htmlProps.className)}>
      <button onClick={() => setCollapsed((prev) => !prev)} className={clsx('w-full cursor-default text-left', collapsed ? '' : 'mb-6')}>
        <Header collapsed={collapsed} text='Слова с' />
      </button>
      <ul className={clsx('grid grid-cols-3 gap-1 max-md:grid-cols-2', collapsed && 'hidden')} data-search>
        {words.map((word) => (
          <li key={word}>
            <ChLink search={word} />
          </li>
        ))}
      </ul>
    </section>
  )
}
