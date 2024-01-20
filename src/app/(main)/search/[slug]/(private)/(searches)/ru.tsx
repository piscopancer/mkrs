import { TSearchProps } from '@/search'
import Save from '../save'
import { stringToReact } from '@/utils'
import RuchFulltext from '../ruch-fulltext'
import { TbChristmasTree, TbEyeClosed, TbHome2, TbTree, TbTrees } from 'react-icons/tb'
import Link from 'next/link'

export default function Ru(props: TSearchProps<'ru'>) {
  console.log(props.search.found, props.search.tr)
  return (
    <article className='mb-24 relative'>
      {props.search.ru && <Save ch={props.search.ru} className='absolute top-0 right-0' />}
      <h1 className='text-3xl mb-8'>{props.search.ru}</h1>
      {props.search.found ? (
        <>
          {props.search.tr && (
            <div data-search className='text-lg mb-12'>
              {stringToReact(props.search.tr)}
            </div>
          )}
          {props.search.inRu && <RuchFulltext examples={props.search.inRu} className='mb-4' />}
        </>
      ) : (
        <>
          <section className='border-2 border-zinc-800 py-5 mx-auto rounded-2xl mb-12'>
            <TbEyeClosed className='h-6 mb-2 stroke-zinc-400 mx-auto' />
            <output className='text-center text-zinc-400 block'>Слова не найдено</output>
          </section>
        </>
      )}
      {props.search.startWith && (
        <section className='mb-12'>
          <p className='font-display text-zinc-200 mb-8 uppercase text-sm'>начинающиеся с</p>
          <ul className='grid grid-cols-3 gap-1'>
            {props.search.startWith.map((word) => (
              <li key={word}>
                <Link href={`/search/${word}`}>{word}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
