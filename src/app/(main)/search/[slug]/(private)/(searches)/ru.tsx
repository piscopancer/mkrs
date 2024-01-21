import { TSearchProps } from '@/search'
import { stringToReact } from '@/utils'
import { TbBookOff } from 'react-icons/tb'
import RuchFulltext from '../ruch-fulltext'
import Save from '../save'
import StartWith from '../start-with'

export default function Ru(props: TSearchProps<'ru'>) {
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
          {props.search.inRu && <RuchFulltext examples={props.search.inRu} className='mb-12' />}
        </>
      ) : (
        <section className='border-2 border-zinc-800 py-2 px-4 rounded-full mb-12 flex items-center gap-4 w-fit'>
          <TbBookOff className='h-5 stroke-zinc-400' />
          <output className='text-zinc-400 text-sm'>Слова не найдено</output>
        </section>
      )}
      {props.search.startWith && <StartWith words={props.search.startWith} className='mb-12' />}
    </article>
  )
}
