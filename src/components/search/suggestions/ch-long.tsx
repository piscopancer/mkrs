import { TSearchProps } from '@/search'
import ByWords from './by-words'

export default function ChLongSuggestions(props: TSearchProps<'ch-long'>) {
  return props.search.byWords && <ByWords words={props.search.byWords} />
}
