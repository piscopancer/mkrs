import Reverso from '@/components/reverso'
import { TSearchProps } from '@/search'

export default function English(props: TSearchProps<'english'>) {
  if (!props.search.ch) return 'Ошибка'
  return <Reverso ch={props.search.ch} chMode />
}
