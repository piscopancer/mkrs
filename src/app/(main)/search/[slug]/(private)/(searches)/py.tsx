import { TSearchProps } from '@/search'
import { classes, stringToReact } from '@/utils'
import Link from 'next/link'

export default function Py(props: TSearchProps<'py'>) {
  return (
    <article className='mb-24'>
      {props.search.found && props.search.words && (
        <ul className='grid grid-cols-[min-content,min-content,1fr] gap-x-6 max-md:flex max-md:flex-col'>
          {props.search.words.map((word, i) => (
            <li key={i} className='contents'>
              <Link href={`/search/${word.ch}`} className='col-span-3 grid grid-cols-[subgrid] items-center rounded-full px-4 py-1 hover:bg-zinc-800 max-md:grid-cols-[min-content,1fr] max-md:rounded-xl max-md:px-2'>
                <span className={classes('text-nowrap text-2xl max-md:row-span-2 max-md:mr-4 max-md:self-end max-md:text-4xl')}>{word.ch}</span>
                <span className={classes('text-nowrap text-zinc-400 max-md:text-sm')}>{word.py}</span>
                <span className={classes('block overflow-hidden text-ellipsis text-nowrap')}>{word.ru ? stringToReact(word.ru) : '-'}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
