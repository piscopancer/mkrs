import { TSearchProps } from '@/search'
import { stringToReact } from '@/utils'
import Copyer from '../copyer'
import Examples from '../examples'
import NotFound from '../not-found'
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
      <article className='relative mb-24'>
        <header className='mb-8 flex items-start gap-4'>
          <h1 className='grow text-3xl'>{props.search.ru}</h1>
          {props.search.ru && <Save ch={props.search.ru} className='ml-auto' />}
        </header>
        {!props.search.found && <NotFound />}
        {props.search.tr && (
          <div data-search className='mb-12 text-lg'>
            {stringToReact(props.search.tr)}
          </div>
        )}
        {props.search.inRu && <RuchFulltext examples={props.search.inRu} className='mb-12' />}
        {props.search.startWith && <StartWith words={props.search.startWith} className='mb-12' />}
        {props.search.examples && <Examples examples={props.search.examples} className='mb-12' />}
      </article>
    </>
  )
}
