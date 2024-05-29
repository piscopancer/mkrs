import { BkrsResponseProps } from '@/bkrs'
import { stringToReact } from '@/utils'
import { DOMNode, Element, domToReact } from 'html-react-parser'
import { Route } from 'next'
import Link from 'next/link'
import Reverso from '../../../../../../components/reverso'
import ByWords from '../by-words'
import ChHeader from '../ch-header'
import Copyer from '../copyer'
import Examples from '../examples'
import NotFound from '../not-found'
import RecentWriter from '../recent-writer'
import RuchFulltext from '../ruch-fulltext'
import Similar from '../similar'
import WordsWith from '../words-with'

export default function Ch(props: BkrsResponseProps<'ch'>) {
  return (
    <>
      {props.response.ch && (
        <>
          <Copyer search={props.response.ch} />
          <RecentWriter search={props.response.ch} />
        </>
      )}
      <article className='relative mb-24'>
        <ChHeader response={props.response} />
        {!props.response.found && <NotFound />}
        {props.response.tr && (
          <div data-search className='mb-12 text-xl max-md:text-base'>
            {stringToReact(props.response.tr, {
              replace: (domNode) => {
                if (domNode instanceof Element && domNode.tagName === 'a') {
                  return (
                    <Link prefetch={false} href={(domNode.attribs as { href: Route }).href}>
                      {domToReact(domNode.children as DOMNode[])}
                    </Link>
                  )
                }
              },
            })}
          </div>
        )}
        {props.response.ch && <Reverso search={props.response.ch} mode='ch-en' className='mb-12' />}
        {props.response.inRu && <RuchFulltext examples={props.response.inRu} className='mb-12' />}
        {props.response.byWords && <ByWords words={props.response.byWords} className='mb-12' />}
        {props.response.examples && <Examples examples={props.response.examples} className='mb-12' />}
        {props.response.wordsWith && <WordsWith words={props.response.wordsWith} className='mb-12' />}
        {props.response.similar && <Similar similar={props.response.similar} className='mb-12' />}
      </article>
    </>
  )
}
