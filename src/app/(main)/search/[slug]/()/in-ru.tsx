'use client'

import { Example } from '@/bkrs'
import { stringToReact } from '@/utils'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
import Header from './header'

export default function InRu(props: React.ComponentProps<'section'> & { examples: Example[] }) {
  const { examples, ...htmlProps } = props
  const [collapsed, setCollapsed] = useState(false)

  return (
    <section {...htmlProps} className={clsx(htmlProps.className)}>
      <button onClick={() => setCollapsed((prev) => !prev)} className={clsx('w-full cursor-default text-left', collapsed ? '' : 'mb-6')}>
        <Header text='В русских словах' collapsed={collapsed} />
      </button>
      <ul className={clsx('grid grid-cols-[1fr_1fr] gap-2 gap-x-8 gap-y-2 max-md:flex max-md:flex-col max-md:gap-x-4', collapsed && 'hidden max-md:hidden')} data-search>
        {examples.map((ex, i) => (
          <li key={i} className='contents rounded-lg py-2 text-lg text-zinc-400 max-md:block max-md:py-1 max-md:text-base'>
            <Link prefetch={false} href={`/search/${ex.heading}`} className='w-fit self-start max-md:mb-2' data-custom>
              {ex.heading}
            </Link>
            <div>{ex.innerHtml && stringToReact(ex.innerHtml)}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
