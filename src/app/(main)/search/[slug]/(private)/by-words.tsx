'use client'

import { TWord } from '@/search'
import { classes, stringToReact } from '@/utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Heading from './heading'

export default function ByWords({ words, ...htmlProps }: React.ComponentProps<'section'> & { words: TWord[] }) {
  const [hovered, setHovered] = useState<null | number>(null)
  const router = useRouter()

  return (
    <section {...htmlProps} className={classes(htmlProps.className)}>
      <Heading text='пословный перевод' className='mb-8' />
      <ul className='grid grid-cols-4 gap-1' onMouseLeave={() => setHovered(null)}>
        {words.map((word, i) => (
          <li key={i}>
            <button
              onMouseEnter={() => {
                setHovered(i)
              }}
              onClick={() => router.push(`/search/${word.ch}`)}
              className={classes(hovered === i ? 'border-zinc-700 bg-zinc-800' : 'border-transparent bg-zinc-800/50', 'h-full grid grid-cols-[min-content,auto] grid-rows-[min-content,auto] rounded-2xl px-3 py-2 gap-y-2 border-2 w-full')}
            >
              <h3 className='text-zinc-200 text-xl text-nowrap text-left'>{word.ch}</h3>
              <p className='bg-zinc-900 rounded-full text-sm px-3 py-0.5 w-fit justify-self-end '>{word.py}</p>
              <span className='text-xs col-span-2 text-left' data-search>
                {word.ru && stringToReact(word.ru)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
