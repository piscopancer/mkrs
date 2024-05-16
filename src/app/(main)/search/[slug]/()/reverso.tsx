import { Tooltip } from '@/components/tooltip'
import { hotkeys } from '@/hotkeys'
import { parseReverso, queryCharacterReverso } from '@/reverso'
import clsx from 'clsx'
import { JSDOM } from 'jsdom'
import { ComponentProps } from 'react'
import { TbExternalLink } from 'react-icons/tb'

export default async function Reverso({ ch, ...htmlProps }: ComponentProps<'article'> & { ch: string }) {
  const reversoHtml = await queryCharacterReverso(ch)
  if (!reversoHtml) return
  const el = new JSDOM(reversoHtml).window.document.body
  const parsedSearch = parseReverso(el)

  return (
    <article {...htmlProps} className={clsx(htmlProps.className, 'rounded-lg border-2 border-zinc-800 px-3 py-2')}>
      <header className='mb-1 flex items-center text-sm text-zinc-600'>
        <h1 className='mr-auto font-display'>Reverso</h1>
        <Tooltip
          content={
            <>
              <span className='text-zinc-500'>({hotkeys.reverso.display})</span> Смотреть на Reverso Context
            </>
          }
        >
          <a href={`https://context.reverso.net/translation/chinese-english/${ch}`} target='_blank' className='text-zinc-600 hover:text-zinc-400'>
            <TbExternalLink className='size-5' />
          </a>
        </Tooltip>
      </header>
      {parsedSearch.type === 'one' && (
        <ul className='flex flex-wrap gap-x-2 text-zinc-400 max-md:max-h-[3lh] max-md:overflow-hidden'>
          {parsedSearch.words.map((w, i) => (
            <li key={i} className='cursor-default duration-500 hover:text-zinc-200'>
              {w}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
