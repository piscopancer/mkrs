import { BkrsResponseProps } from '@/bkrs'
import ChLongSegments from '../segments'

export default function ChLong({ response }: BkrsResponseProps<'ch-long'>) {
  return (
    <article className='relative mb-24'>
      <ChLongSegments segments={response.segments} />
    </article>
  )
}
