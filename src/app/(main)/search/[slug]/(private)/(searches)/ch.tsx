import { TSearchProps } from '@/search'
import { stringToReact } from '@/utils'
import ByWords from '../by-words'
import ChHeader from '../ch-header'
import Copyer from '../copyer'
import Examples from '../examples'
import NotFound from '../not-found'
import RecentWriter from '../recent-writer'
import RuchFulltext from '../ruch-fulltext'
import Similar from '../similar'
import WordsWith from '../words-with'

export default function Ch(props: TSearchProps<'ch'>) {
  return (
    <>
      {props.search.ch && (
        <>
          <Copyer search={props.search.ch} />
          <RecentWriter search={props.search.ch} />
        </>
      )}
      <article className='relative mb-24'>
        <ChHeader search={props.search} />
        {!props.search.found && <NotFound />}
        {props.search.tr && (
          <div data-search className='mb-12 text-xl max-md:text-base'>
            {stringToReact(props.search.tr)}
          </div>
        )}
        {props.search.inRu && <RuchFulltext examples={props.search.inRu} className='mb-12' />}
        {props.search.byWords && <ByWords words={props.search.byWords} className='mb-12' />}
        {props.search.examples && <Examples examples={props.search.examples} className='mb-12' />}
        {props.search.wordsWith && <WordsWith words={props.search.wordsWith} className='mb-12' />}
        {props.search.similar && <Similar similar={props.search.similar} className='mb-12' />}
      </article>
    </>
  )
}
