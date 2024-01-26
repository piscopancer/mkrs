'use client'

import { TWord } from '@/search'
import { classes, stringToReact } from '@/utils'
import Link from 'next/link'
import { useState } from 'react'
import Heading from './heading'

export default function ByWords({ words, ...htmlProps }: React.ComponentProps<'section'> & { words: TWord[] }) {
  const [hovered, setHovered] = useState<null | number>(null)

  return (
    <section {...htmlProps} className={classes(htmlProps.className)}>
      <Heading text='пословный перевод' className='mb-6' />
      <ul className='grid grid-cols-4 gap-1 max-md:grid-cols-2 max-lg:grid-cols-3' onMouseLeave={() => setHovered(null)}>
        {words.map((word, i) => (
          <li key={i}>
            <Link
              href={`/search/${word.ch}`}
              onMouseEnter={() => {
                setHovered(i)
              }}
              className={classes(hovered === i ? 'border-zinc-700 bg-zinc-800' : 'border-transparent bg-zinc-800/50', 'h-full grid grid-cols-[min-content,auto] grid-rows-[min-content,auto] rounded-2xl px-3 py-2 gap-y-2 border-2 w-full max-md:py-1 max-md:px-1.5 max-md:rounded-lg')}
            >
              <h3 className='text-zinc-200 text-xl text-nowrap text-left'>{word.ch}</h3>
              <p className='bg-zinc-900 rounded-full text-sm px-3 py-0.5 w-fit justify-self-end self-center max-md:text-xs'>{word.py}</p>
              <span className='text-xs col-span-2 text-left' data-search>
                {word.ru && stringToReact(word.ru)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
