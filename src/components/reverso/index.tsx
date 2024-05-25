import ReversoLogo from '@/assets/reverso'
import { Tooltip } from '@/components/tooltip'
import { hotkeys } from '@/hotkeys'
import { parseReverso, querySearch } from '@/reverso'
import clsx from 'clsx'
import { JSDOM } from 'jsdom'
import Link from 'next/link'
import { ComponentProps, Fragment } from 'react'
import { TbExternalLink } from 'react-icons/tb'
import Examples from './examples'
import ReversoOpener from './reverso-opener'

export default async function Reverso({ ch, chMode = false, ...htmlProps }: ComponentProps<'article'> & { ch: string; chMode?: boolean }) {
  const reversoHtml = await querySearch(ch, chMode ? 'en-ch' : 'ch-en')
  if (!reversoHtml) return
  const el = new JSDOM(reversoHtml).window.document.body
  const search = parseReverso(el)

  if (search.type === 'error') {
    console.warn('Reverso Context error')
    return <ReversoOpener ch={ch} />
  }

  return (
    <>
      <ReversoOpener ch={ch} />
      <article {...htmlProps} className={clsx(htmlProps.className, 'rounded-lg border-2 border-zinc-800')}>
        <header className='flex items-center bg-zinc-800/50 text-sm'>
          <Tooltip content={`type: ${search.type}, chMode: ${chMode}`} delay={2000}>
            <button className='ml-3 mr-auto h-4 cursor-default text-zinc-500'>
              <ReversoLogo className='h-full' />
            </button>
          </Tooltip>
          <Examples examples={search.examples} className='pl-4 pr-2' />
          <Tooltip
            content={
              <>
                <span className='text-zinc-500'>({hotkeys.reverso.display})</span> Смотреть на Reverso Context
              </>
            }
          >
            <a href={`https://context.reverso.net/translation/chinese-english/${ch}`} target='_blank' className='text-zinc-400 duration-100 hover:text-zinc-200'>
              <TbExternalLink className='size-9 p-2' />
            </a>
          </Tooltip>
        </header>
        <div className='px-3 py-2'>
          {search.type === 'one' && (
            <ul className={clsx('text-zinc-400', chMode ? '-mx-2 flex flex-wrap' : '')}>
              {search.translations.map((tr, i, arr) => (
                <Fragment key={i}>
                  <li className={clsx(chMode ? 'block' : 'inline')}>
                    <Link href={`/search/${tr}`} className={clsx('duration-100 max-md:active:text-zinc-200 md:hover:text-zinc-200', chMode ? 'block px-2 py-0.5 text-lg max-md:px-1.5 max-md:text-base ' : '')} key={i}>
                      {tr}
                    </Link>
                  </li>
                  {!chMode && i < arr.length - 1 && <span className='cursor-default'>{', '}</span>}
                </Fragment>
              ))}
            </ul>
          )}
          {search.type === 'many' && (
            <>
              {search.translations && <span className='mb-2 block text-zinc-400 max-md:max-h-[3lh] max-md:overflow-hidden'>{search.translations.join(', ')}</span>}
              <ul className={clsx('grid grid-cols-[auto,1fr] text-zinc-400', chMode ? 'gap-x-4' : 'gap-x-3 ')}>
                {search.groups.map((group, i) => (
                  <li key={i} className='col-span-full grid grid-cols-subgrid'>
                    <p className={clsx('text-zinc-500', chMode && 'translate-y-1.5 max-md:translate-y-1')}>{group.original}</p>
                    <ul className={clsx('text-zinc-400', chMode ? '-mx-2 flex flex-wrap' : '')}>
                      {group.translations.map((tr, i, arr) => (
                        <Fragment key={i}>
                          <li className={clsx(chMode ? 'block' : 'inline')}>
                            <Link href={`/search/${tr}`} className={clsx('duration-100 max-md:active:text-zinc-200 md:hover:text-zinc-200', chMode ? 'block px-2 py-0.5 text-lg max-md:px-1.5 max-md:text-base' : '')} key={i}>
                              {tr}
                            </Link>
                          </li>
                          {!chMode && i < arr.length - 1 && <span className='cursor-default'>{', '}</span>}
                        </Fragment>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </article>
    </>
  )
}
