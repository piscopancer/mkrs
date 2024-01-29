'use client'

import { TWord } from '@/search'
import { classes, stringToReact } from '@/utils'
import Link from 'next/link'
import Heading from './heading'

export default function ByWords({ words, ...htmlProps }: React.ComponentProps<'section'> & { words: TWord[] }) {
  return (
    <section {...htmlProps} className={classes(htmlProps.className)}>
      <Heading text='пословный перевод' className='mb-6' />
      <ul className='grid grid-cols-4 gap-1 max-lg:grid-cols-3 max-md:grid-cols-2'>
        {words.map((word, i) => (
          <li key={i} className={classes('hopper h-full w-full gap-y-2 rounded-2xl border-2 border-transparent bg-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-800 max-md:rounded-lg')}>
            <div className='grid grid-cols-2 grid-rows-[min-content,1fr] gap-2 px-2 py-1.5 max-md:block max-md:px-1.5 max-md:py-1 [&_a]:!pointer-events-none [&_a]:!text-zinc-200'>
              <h3 className='text-nowrap text-left text-xl text-zinc-200 max-sm:mb-1'>{word.ch}</h3>
              <p className='w-fit self-center justify-self-end overflow-hidden text-ellipsis text-nowrap rounded-full bg-zinc-900 px-3 py-0.5 text-sm max-md:text-xs max-sm:mb-1 max-sm:bg-transparent max-sm:p-0 max-sm:text-zinc-400'>{word.py}</p>
              <div className='col-span-2 text-left text-xs' data-search>
                {word.ru && stringToReact(word.ru)}
              </div>
            </div>
            <Link href={`/search/${word.ch}`} className='block h-full'></Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
