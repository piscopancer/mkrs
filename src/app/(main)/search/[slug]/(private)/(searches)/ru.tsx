import { TSearchProps } from '@/search'
import { stringToReact } from '@/utils'
import { TbBookOff } from 'react-icons/tb'
import Copyer from '../copyer'
import Examples from '../examples'
import RecentWriter from '../recent-writer'
import RuchFulltext from '../ruch-fulltext'
import Save from '../save'
import StartWith from '../start-with'

export default function Ru(props: TSearchProps<'ru'>) {
  return (
    <>
      {props.search.ru && (
        <>
          <Copyer search={props.search.ru} />
          <RecentWriter search={props.search.ru} />
        </>
      )}
      <article className='mb-24 relative'>
        <header className='flex gap-4 mb-8 items-start'>
          <h1 className='text-3xl grow'>{props.search.ru}</h1>
          {props.search.ru && <Save ch={props.search.ru} className='ml-auto' />}
        </header>
        {props.search.found ? (
          <>
            {props.search.tr && (
              <div data-search className='text-lg mb-12'>
                {stringToReact(props.search.tr)}
              </div>
            )}
            {props.search.inRu && <RuchFulltext examples={props.search.inRu} className='mb-12' />}
            {props.search.examples && <Examples examples={props.search.examples} className='mb-12' />}
          </>
        ) : (
          <section className='border-2 border-zinc-800 py-2 px-4 rounded-full mb-12 flex items-center gap-4 w-fit'>
            <TbBookOff className='h-5 stroke-zinc-400' />
            <output className='text-zinc-400 text-sm'>Слова не найдено</output>
          </section>
        )}
        {props.search.startWith && <StartWith words={props.search.startWith} className='mb-12' />}
      </article>
    </>
  )
}
