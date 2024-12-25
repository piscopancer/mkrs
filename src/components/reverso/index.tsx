'use client'

import { queryReverso } from '@/app/actions'
import ReversoLogo from '@/assets/reverso'
import { Tooltip } from '@/components/tooltip'
import useHotkey from '@/hooks/use-hotkey'
import { hotkeys } from '@/hotkeys'
import { queryKeys } from '@/query'
import { ReversoSearchMode } from '@/reverso'
import { searchStore } from '@/search'
import * as Dialog from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import Link from 'next/link'
import { ComponentProps, Fragment, useState } from 'react'
import { TbChevronDown, TbChevronUp, TbExternalLink, TbLoader } from 'react-icons/tb'
import Examples from './examples'

export default function Reverso({ search, mode, ...htmlProps }: ComponentProps<'article'> & { search: string; mode: ReversoSearchMode }) {
  const reversoQuery = useQuery({
    queryKey: queryKeys.reverso(search),
    queryFn: () => queryReverso(search, mode),
  })
  const [collapsed, setCollapsed] = useState(false)
  const CollapsedIcon = collapsed ? TbChevronDown : TbChevronUp
  const searchFocusedSnap = searchStore.focused.use()
  useHotkey(hotkeys.reverso.keys, (_, e) => {
    if (!searchFocusedSnap && !e.ctrlKey) window.open(`https://context.reverso.net/translation/chinese-english/${search}`, '_blank')?.focus()
  })

  return (
    <>
      <article {...htmlProps} className={clsx(htmlProps.className)}>
        <header className='mb-4 flex h-8 items-center rounded-t-2xl border-x-2 border-t-2 border-zinc-800'>
          <button onClick={() => setCollapsed((prev) => !prev)} className='flex h-full cursor-default items-center rounded-tl-[calc(theme(borderRadius.2xl)-2px)] bg-zinc-800 pl-3 pr-4 text-zinc-200'>
            <CollapsedIcon className='mr-3 text-lg' />
            <ReversoLogo className='h-4' />
          </button>
          <div className='bg-halftone h-full flex-1' />
          <Examples examples={reversoQuery.data?.type === 'error' ? [] : reversoQuery.data?.examples ?? []}>
            <Dialog.Trigger disabled={reversoQuery.data?.type === 'error' || !!!reversoQuery.data?.examples?.length} className={clsx('mr-[2px] flex h-full items-center bg-zinc-800 px-4 duration-100 enabled:hover:bg-zinc-700 disabled:hidden')}>
              Примеры
            </Dialog.Trigger>
          </Examples>
          <Tooltip
            content={
              <>
                <span className='text-zinc-500'>({hotkeys.reverso.display})</span> Смотреть на Reverso Context
              </>
            }
          >
            <a href={`https://context.reverso.net/translation/chinese-english/${search}`} target='_blank' className='flex aspect-square h-full items-center justify-center rounded-tr-[calc(theme(borderRadius.2xl)-2px)] bg-zinc-800 pl-2 pr-2.5 duration-100 hover:bg-zinc-700'>
              <TbExternalLink className='size-5' />
            </a>
          </Tooltip>
        </header>
        <div className={clsx(collapsed && 'hidden')}>
          {reversoQuery.isLoading ? (
            <div>
              <TbLoader className='mx-auto animate-spin text-zinc-500' />
            </div>
          ) : !reversoQuery.data || reversoQuery.data.type === 'error' ? (
            <p className='text-zinc-500'>Не найдено</p>
          ) : (
            <div>
              {reversoQuery.data.type === 'one' && (
                <ul className={clsx('text-zinc-400', mode === 'en-ch' ? '-mx-2 flex flex-wrap' : '')}>
                  {reversoQuery.data.translations.map((tr, i, arr) => (
                    <Fragment key={i}>
                      <li className={clsx(mode === 'en-ch' ? 'block' : 'inline')}>
                        <Link prefetch={false} href={`/search/${tr}`} className={clsx('duration-100 max-md:active:text-zinc-200 md:hover:text-zinc-200', mode === 'en-ch' ? 'block px-2 py-0.5 text-lg max-md:px-1.5 max-md:text-base ' : '')} key={i}>
                          {tr}
                        </Link>
                      </li>
                      {mode !== 'en-ch' && i < arr.length - 1 && <span className='cursor-default'>{', '}</span>}
                    </Fragment>
                  ))}
                </ul>
              )}
              {reversoQuery.data.type === 'many' && (
                <>
                  {reversoQuery.data.translations && <span className='mb-2 block text-zinc-400 max-md:max-h-[3lh] max-md:overflow-hidden'>{reversoQuery.data.translations.join(', ')}</span>}
                  <ul className={clsx('grid grid-cols-[auto,1fr] text-zinc-400', mode === 'en-ch' ? 'gap-x-4' : 'gap-x-3 ')}>
                    {reversoQuery.data.groups.map((group, i) => (
                      <li key={i} className='col-span-full grid grid-cols-subgrid'>
                        <p className={clsx('text-zinc-500', mode === 'en-ch' && 'translate-y-1.5 max-md:translate-y-1')}>{group.original}</p>
                        <ul className={clsx('text-zinc-400', mode === 'en-ch' ? '-mx-2 flex flex-wrap' : '')}>
                          {group.translations.map((tr, i, arr) => (
                            <Fragment key={i}>
                              <li className={clsx(mode === 'en-ch' ? 'block' : 'inline')}>
                                <Link prefetch={false} href={`/search/${tr}`} className={clsx('duration-100 max-md:active:text-zinc-200 md:hover:text-zinc-200', mode === 'en-ch' ? 'block px-2 py-0.5 text-lg max-md:px-1.5 max-md:text-base' : '')} key={i}>
                                  {tr}
                                </Link>
                              </li>
                              {mode !== 'en-ch' && i < arr.length - 1 && <span className='cursor-default'>{', '}</span>}
                            </Fragment>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </article>
    </>
  )
}
