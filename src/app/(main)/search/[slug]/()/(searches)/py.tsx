import { BkrsResponseProps } from '@/bkrs'
import { stringToReact } from '@/utils'
import clsx from 'clsx'
import Link from 'next/link'

export default function Py(props: BkrsResponseProps<'py'>) {
  return (
    <section className='mb-24'>
      {props.response.found && props.response.words && (
        <ul className='grid grid-cols-[min-content,min-content,1fr] gap-x-6 max-md:flex max-md:flex-col'>
          {props.response.words.map((word, i) => (
            <li key={i} className='contents'>
              <Link href={`/search/${word.ch}`} className='col-span-3 grid grid-cols-[subgrid] items-center border-b-2 border-dashed border-zinc-800 py-2 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 max-md:grid-cols-[min-content,1fr]'>
                <b className={clsx('max-w-[12ch] overflow-hidden text-ellipsis text-nowrap text-2xl font-normal max-md:row-span-2 max-md:mr-4 max-md:self-end max-md:text-4xl')}>{word.ch}</b>
                <span className={clsx('max-w-[20ch] overflow-hidden text-ellipsis text-nowrap text-zinc-400 max-md:text-sm')}>{word.py}</span>
                <span className={clsx('block overflow-hidden text-ellipsis text-nowrap')}>{word.ru ? stringToReact(word.ru) : '-'}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
