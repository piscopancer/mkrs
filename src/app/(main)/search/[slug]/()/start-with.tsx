import clsx from 'clsx'
import Link from 'next/link'
import { ComponentProps } from 'react'
import Header from './header'

export default function StartWith({ words, ...htmlProps }: ComponentProps<'section'> & { words: string[] }) {
  return (
    <section {...htmlProps} className={clsx(htmlProps.className)}>
      <Header text='Начинаются с' className='mb-6' />
      <ul className='grid grid-cols-3 gap-1 max-md:grid-cols-2' data-search>
        {words.map((word) => (
          <li key={word}>
            <Link prefetch={false} href={`/search/${word}`} className='text-lg max-md:text-sm'>
              {word}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
