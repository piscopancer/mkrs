import { BkrsResponseProps } from '@/bkrs'
import ByWords from './by-words'

export default function ChLongSuggestions(props: BkrsResponseProps<'ch-long'>) {
  return props.response.byWords && <ByWords words={props.response.byWords} />
}
