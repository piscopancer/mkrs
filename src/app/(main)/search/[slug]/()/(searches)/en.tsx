import { BkrsResponseProps } from '@/bkrs'
import Reverso from '@/components/reverso'

export default function English(props: BkrsResponseProps<'english'>) {
  if (!props.response.ch) return 'Ошибка'

  return <Reverso search={props.response.ch} mode='en-ch' />
}
