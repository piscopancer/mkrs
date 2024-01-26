import { TSearchProps } from '@/search'
import { stringToReact } from '@/utils'
import ByWords from '../by-words'
import Copyer from '../copyer'
import Examples from '../examples'
import RecentWriter from '../recent-writer'
import RuchFulltext from '../ruch-fulltext'
import Save from '../save'

export default function Ch(props: TSearchProps<'ch'>) {
  return (
    <>
      {props.search.ch && (
        <>
          <Copyer search={props.search.ch} />
          <RecentWriter search={props.search.ch} />
        </>
      )}
      <article className='mb-24 relative'>
        <header className='flex gap-4 mb-8 items-start'>
          <h1 className='text-5xl mr-auto'>{props.search.ch}</h1>
          {props.search.ch && <Save ch={props.search.ch} className='' />}
        </header>
        <h2 className='text-zinc-400 mb-8 rounded-full px-3 w-fit bg-zinc-800 max-md:text-sm max-md:max-w-[75%]'>{props.search.py}</h2>
        {props.search.tr && (
          <div data-search className='text-lg mb-12'>
            {stringToReact(props.search.tr)}
          </div>
        )}
        {props.search.inRu && <RuchFulltext examples={props.search.inRu} className='mb-12' />}
        {props.search.byWords && <ByWords words={props.search.byWords} className='mb-12' />}
        {props.search.examples && <Examples examples={props.search.examples} className='mb-12' />}
      </article>
    </>
  )
}
