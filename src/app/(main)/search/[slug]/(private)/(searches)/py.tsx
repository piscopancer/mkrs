import { TSearchProps } from '@/search'
import { classes, stringToReact } from '@/utils'
import Link from 'next/link'

export default function Py(props: TSearchProps<'py'>) {
  return (
    <article>
      {props.search.found && props.search.words && (
        <ul className='flex flex-col'>
          {props.search.words.map((word, i) => (
            <Link key={i} href={`/search/${word.ch}`} className='py-1 gap-x-8 px-4 items-center grid-cols-[1fr,1fr,3fr] grid rounded-full hover:bg-zinc-800'>
              <span className={classes('text-nowrap text-2xl')}>{word.ch}</span>
              <span className={classes('text-nowrap text-zinc-400')}>{word.py}</span>
              <span className={classes('text-nowrap ')}>{word.ru ? stringToReact(word.ru) : '-'}</span>
            </Link>
          ))}
        </ul>
      )}
    </article>
  )
}
