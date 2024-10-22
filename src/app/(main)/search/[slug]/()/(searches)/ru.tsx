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
        {response.tr && (
          <div data-search className='mb-12 text-lg'>
            {stringToReact(response.tr, {
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
        {response.inRu && <RuchFulltext examples={response.inRu} className='mb-12' />}
        {response.startWith && <StartWith words={response.startWith} className='mb-12' />}
        {response.examples && <Examples examples={response.examples} className='mb-12' />}
      </article>
    </>
  )
}
