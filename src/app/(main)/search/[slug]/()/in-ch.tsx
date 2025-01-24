'use client'

import { Example } from '@/bkrs'
import { stringToReact } from '@/utils'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'
import Header from './header'

export default function InCh({ ch, ...compProps }: React.ComponentProps<'section'> & { ch: Example[] }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <section {...compProps} className={clsx(compProps.className)}>
      <button onClick={() => setCollapsed((prev) => !prev)} className={clsx('w-full cursor-default text-left', collapsed ? '' : 'mb-6')}>
        <Header text='В китайских словах' collapsed={collapsed} />
      </button>
      <ul className={clsx('grid grid-cols-[1fr_1fr] gap-2 gap-x-8 gap-y-2 max-md:flex max-md:flex-col max-md:gap-x-4', collapsed && 'hidden max-md:hidden')} data-search>
        {ch.map((ch, i) => (
          <li key={i} className='contents rounded-lg py-2 text-lg text-zinc-400 max-md:block max-md:py-1 max-md:text-sm'>
            <Link prefetch={false} href={`/search/${ch.heading}`} className='w-fit self-start max-md:mb-1' data-custom>
              {ch.heading}
            </Link>
            <div>{ch.innerHtml && stringToReact(ch.innerHtml)}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
