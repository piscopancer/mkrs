import { TSearchProps } from '@/search'
import { stringToReact } from '@/utils'
import RuchFulltext from '../ruch-fulltext'
import Save from '../save'

export default function Ch(props: TSearchProps<'ch'>) {
  return (
    <article data-search className='mb-24 relative'>
      {props.search.ch && <Save ch={props.search.ch} className='absolute top-0 right-0' />}
      <h1 className='text-5xl mb-4'>{props.search.ch}</h1>
      <h2 className='text-zinc-400 mb-8 rounded-full px-3 bg-zinc-800 w-fit'>{props.search.py}</h2>
      {props.search.tr && <div className='text-lg mb-12'>{stringToReact(props.search.tr)}</div>}
      {props.search.inRu && <RuchFulltext examples={props.search.inRu} />}
    </article>
  )
}
