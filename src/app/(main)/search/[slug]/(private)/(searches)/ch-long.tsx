import { TSearchProps } from '@/search'
import Save from '../save'
import ByWords from '../by-words'

export default function ChLong(props: TSearchProps<'ch-long'>) {
  return (
    <article className='mb-24 relative'>
      {props.search.ch && <Save ch={props.search.ch} className='absolute top-0 right-0' />}
      <h1 className='text-5xl mb-4'>{props.search.ch}</h1>
      {props.search.byWords && <ByWords words={props.search.byWords} className='mb-12' />}
    </article>
  )
}
