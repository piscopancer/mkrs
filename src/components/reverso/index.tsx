import ReversoLogo from '@/assets/reverso'
import { Tooltip } from '@/components/tooltip'
import { hotkeys } from '@/hotkeys'
import { parseReverso, queryCharacterReverso } from '@/reverso'
import clsx from 'clsx'
import { JSDOM } from 'jsdom'
import { ComponentProps } from 'react'
import { TbExternalLink } from 'react-icons/tb'
import Examples from './examples'
import ReversoOpener from './reverso-opener'

export default async function Reverso({ ch, ...htmlProps }: ComponentProps<'article'> & { ch: string }) {
  const reversoHtml = await queryCharacterReverso(ch)
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
        <header className='mb-1 flex text-sm'>
          <ReversoLogo className='ml-3 mr-auto mt-2 h-4 text-zinc-600' />
          <Examples examples={search.examples} className='px-1' />
          <Tooltip
            content={
              <>
                <span className='text-zinc-500'>({hotkeys.reverso.display})</span> Смотреть на Reverso Context
              </>
            }
          >
            <a href={`https://context.reverso.net/translation/chinese-english/${ch}`} target='_blank' className='text-zinc-600 hover:text-zinc-400'>
              <TbExternalLink className='size-8 p-1.5' />
            </a>
          </Tooltip>
        </header>
        <div className='mx-3 mb-2'>
          {search.type === 'one' && <p className='text-zinc-400 max-md:line-clamp-3'>{search.translations.join(', ')}</p>}
          {search.type === 'many' && (
            <>
              {search.translations.length && <span className='mb-2 block text-zinc-400 max-md:max-h-[3lh] max-md:overflow-hidden'>{search.translations.join(', ')}</span>}
              <ul className='grid grid-cols-[auto,1fr] gap-x-3 text-zinc-400 max-md:gap-x-2'>
                {search.groups.map((group, i) => (
                  <li key={i} className='col-span-full grid grid-cols-subgrid'>
                    <span className='text-zinc-500'>{group.original}</span>
                    <span>{group.translations.join(', ')}</span>
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
