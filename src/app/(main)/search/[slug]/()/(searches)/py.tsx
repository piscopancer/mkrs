import { BkrsResponseProps } from '@/bkrs'
import { stringToReact } from '@/utils'
import clsx from 'clsx'
import Link from 'next/link'

export default function Py(props: BkrsResponseProps<'py'>) {
  return (
    <section className='mb-24'>
      {props.response.found && props.response.words && (
        <ul className='grid grid-cols-[min-content,min-content,1fr] gap-x-6 max-md:flex max-md:flex-col'>
          {props.response.words.map((word, i, arr) => (
            <li key={i} className='group contents'>
              <Link prefetch={false} href={`/search/${word.ch}`} className='col-span-3 -mx-2 grid grid-cols-[subgrid] items-center rounded-md p-2 hover:bg-zinc-800/50 group-last:border-0 max-md:grid-cols-[min-content,1fr]'>
                <b className={clsx('max-w-[12ch] overflow-hidden text-ellipsis text-nowrap text-xl font-normal max-md:row-span-2 max-md:mr-4 max-md:self-end max-md:text-4xl')}>{word.ch}</b>
                <span className={clsx('max-w-[20ch] overflow-hidden text-ellipsis text-nowrap text-zinc-400 duration-100 group-hover:text-zinc-200 max-md:text-sm')}>{word.py}</span>
                <span className={clsx('block overflow-hidden text-ellipsis text-nowrap')}>{word.ru ? stringToReact(word.ru) : '-'}</span>
              </Link>
              {i < arr.length - 1 && <div className='col-span-full grid grid-cols-[subgrid] border-b border-zinc-800' />}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
