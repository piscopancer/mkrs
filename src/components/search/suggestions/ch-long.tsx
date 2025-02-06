import { BkrsResponseProps } from '@/bkrs'
import Segments from './by-words'

export default function ChLongSuggestions(props: BkrsResponseProps<'ch-long'>) {
  return props.response.segments && <Segments cards={props.response.segments.cards} />
}
