import { BkrsResponseProps } from '@/bkrs'
import Copyer from '../copyer'
import Examples from '../examples'
import InCh from '../in-ch'
import InRu from '../in-ru'
import NotFound from '../not-found'
import RecentWriter from '../recent-writer'
import Save from '../save'
import StartWith from '../start-with'
import Tr from '../tr'

export default function Ru({ response }: BkrsResponseProps<'ru'>) {
  return (
    <>
      {response.ru && (
        <>
          <Copyer search={response.ru} />
          <RecentWriter search={response.ru} />
        </>
      )}
      <article className='relative mb-24'>
        <header className='mb-8 flex items-start gap-4'>
          <h1 className='grow text-3xl'>{response.ru}</h1>
          {response.ru && <Save ch={response.ru} className='ml-auto' />}
        </header>
        {!response.found && <NotFound />}
        {response.tr && <Tr tr={response.tr} className='mb-12' />}
        {response.inRu && <InRu examples={response.inRu} className='mb-12' />}
        {response.inCh && <InCh ch={response.inCh} className='mb-12' />}
        {response.startWith && <StartWith words={response.startWith} className='mb-12' />}
        {response.examples && <Examples examples={response.examples} className='mb-12' />}
      </article>
    </>
  )
}
