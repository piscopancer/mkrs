import { BkrsResponseProps } from '@/bkrs'
import Reverso from '../../../../../../components/reverso'
import ByWords from '../by-words'
import ChHeader from '../ch-header'
import Copyer from '../copyer'
import Examples from '../examples'
import Frequent from '../frequent'
import InRu from '../in-ru'
import NotFound from '../not-found'
import RecentWriter from '../recent-writer'
import Similar from '../similar'
import Tr from '../tr'
import WordsWith from '../words-with'

export default function Ch({ response }: BkrsResponseProps<'ch'>) {
  return (
    <>
      {response.ch && (
        <>
          <Copyer search={response.ch} />
          <RecentWriter search={response.ch} />
        </>
      )}
      <article className='relative mb-24'>
        <ChHeader response={response} />
        {!response.found && <NotFound />}
        {response.tr && <Tr tr={response.tr} className='mb-12' />}
        {response.frequent && <Frequent frequent={response.frequent} className='mb-12' />}
        {response.ch && <Reverso search={response.ch} mode='ch-en' className='mb-12' />}
        {response.inRu && <InRu examples={response.inRu} className='mb-12' />}
        {response.byWords && <ByWords words={response.byWords} className='mb-12' />}
        {response.examples && <Examples examples={response.examples} className='mb-12' />}
        {response.wordsWith && <WordsWith words={response.wordsWith} className='mb-12' />}
        {response.similar && <Similar similar={response.similar} className='mb-12' />}
      </article>
    </>
  )
}
