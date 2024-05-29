import { BkrsResponseProps } from '@/bkrs'
import ByWords from '../by-words'
import Save from '../save'

export default function ChLong(props: BkrsResponseProps<'ch-long'>) {
  return (
    <article className='relative mb-24'>
      {props.response.ch && <Save ch={props.response.ch} className='absolute right-0 top-0' />}
      <h1 className='mb-4 text-5xl'>{props.response.ch}</h1>
      {props.response.byWords && <ByWords words={props.response.byWords} className='mb-12' />}
    </article>
  )
}
