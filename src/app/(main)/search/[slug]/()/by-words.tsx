'use client'

import { TWord } from '@/search'
import { stringToReact } from '@/utils'
import clsx from 'clsx'
import Link from 'next/link'
import Header from './header'

export default function ByWords({ words, ...htmlProps }: React.ComponentProps<'section'> & { words: TWord[] }) {
  return (
    <section {...htmlProps} className={clsx(htmlProps.className)}>
      <Header text='Пословный перевод' className='mb-6' />
      <ul className='grid grid-cols-4 gap-1.5 max-lg:grid-cols-3 max-md:grid-cols-2'>
        {words.map((word, i) => (
          <li key={i} className={clsx('hopper h-full w-full gap-y-2 rounded-xl bg-zinc-800/50 duration-100 hover:bg-zinc-800 max-md:rounded-lg')}>
            <article className='grid grid-cols-2 grid-rows-[min-content,1fr] gap-2 px-3 py-2 max-md:block max-md:px-1.5 max-md:py-1 [&_a]:!pointer-events-none [&_a]:!text-zinc-200'>
              <header className='col-span-full grid grid-cols-subgrid'>
                <h3 className='text-nowrap text-left text-xl text-zinc-200 max-sm:mb-1'>{word.ch}</h3>
                <span className='mr w-fit self-end justify-self-end overflow-hidden text-ellipsis text-nowrap font-mono text-sm text-zinc-400 max-md:text-xs max-sm:mb-1 max-sm:justify-self-start max-sm:bg-transparent max-sm:p-0'>{word.py}</span>
              </header>
              <div className='col-span-2 text-left text-xs' data-search>
                {word.ru && stringToReact(word.ru)}
              </div>
            </article>
            <Link href={`/search/${word.ch}`} className='block h-full'></Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
