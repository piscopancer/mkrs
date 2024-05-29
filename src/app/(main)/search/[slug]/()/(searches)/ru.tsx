import { BkrsResponseProps } from '@/bkrs'
import { stringToReact } from '@/utils'
import { DOMNode, Element, domToReact } from 'html-react-parser'
import { Route } from 'next'
import Link from 'next/link'
import Copyer from '../copyer'
import Examples from '../examples'
import NotFound from '../not-found'
import RecentWriter from '../recent-writer'
import RuchFulltext from '../ruch-fulltext'
import Save from '../save'
import StartWith from '../start-with'

export default function Ru(props: BkrsResponseProps<'ru'>) {
  return (
    <>
      {props.response.ru && (
        <>
          <Copyer search={props.response.ru} />
          <RecentWriter search={props.response.ru} />
        </>
      )}
      <article className='relative mb-24'>
        <header className='mb-8 flex items-start gap-4'>
          <h1 className='grow text-3xl'>{props.response.ru}</h1>
          {props.response.ru && <Save ch={props.response.ru} className='ml-auto' />}
        </header>
        {!props.response.found && <NotFound />}
        {props.response.tr && (
          <div data-search className='mb-12 text-lg'>
            {stringToReact(props.response.tr, {
              replace: (domNode) => {
                if (domNode instanceof Element && domNode.tagName === 'a') {
                  return <Link href={(domNode.attribs as { href: Route }).href}>{domToReact(domNode.children as DOMNode[])}</Link>
                }
              },
            })}
          </div>
        )}
        {props.response.inRu && <RuchFulltext examples={props.response.inRu} className='mb-12' />}
        {props.response.startWith && <StartWith words={props.response.startWith} className='mb-12' />}
        {props.response.examples && <Examples examples={props.response.examples} className='mb-12' />}
      </article>
    </>
  )
}
