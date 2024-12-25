'use client'

import { queryBkrs, queryReverso } from '@/app/actions'
import { BkrsResponseProps, BkrsResponseType } from '@/bkrs'
import * as Article from '@/components/article'
import useHotkey from '@/hooks/use-hotkey'
import { hotkeys } from '@/hotkeys'
import { ReversoResponseProps, ReversoResponseType } from '@/reverso'
import { findSuggestions, ResponseProps, searchStore } from '@/search'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { GiCat } from 'react-icons/gi'
import { TbApps, TbLoader, TbSearch } from 'react-icons/tb'
import { Tooltip } from '../tooltip'
import ExactFound from './exact-found'
import ChSuggestions from './suggestions/ch'
import ChLongSuggestions from './suggestions/ch-long'
import ManySuggestions from './suggestions/many'
import OneSuggestions from './suggestions/one'
import PySuggestions from './suggestions/py'
import RuSuggestions from './suggestions/ru'
import Tools from './tools'
import { findExact, selectSuggestion } from './utils'

const catChance = 0.01
const searchTimeout = 0.5

export default function Search(props: React.ComponentProps<'search'>) {
  const searchSnap = searchStore.use()
  const inputRef = useRef<HTMLInputElement>(null)
  const selfRef = useRef<HTMLElement>(null!)
  const router = useRouter()
  const [querying, setQuerying] = useState(false)
  const [showCat, setShowCat] = useState(false)
  const searchTimer = useRef<NodeJS.Timeout | null>(null)

  useHotkey(
    hotkeys.focus.keys,
    () => {
      searchStore.focused.set(true)
      if (searchStore.response) {
        searchStore.showSuggestions.set(true)
      }
    },
    { preventDefault: !searchStore.focused.get() || undefined },
  )

  useHotkey(['Escape'], () => {
    searchStore.focused.set(false)
    searchStore.showTools.set(false)
    searchStore.showSuggestions.set(false)
  })

  useHotkey(hotkeys.search.keys, () => {
    if (searchStore.search && searchStore.selectedSuggestion.get() === -1) {
      selectSuggestion(router, searchStore.search.get())
    }
  })

  useHotkey(
    hotkeys.tools.keys,
    () => {
      if (!searchStore.focused.get()) {
        searchStore.showTools.set(!searchStore.showTools.get())
        searchStore.focused.set(!searchStore.showTools.get())
      }
    },
    { preventDefault: !searchStore.focused.get() || undefined },
  )

  useHotkey(['v', 'м'], async (_, e) => {
    if (e.ctrlKey && !searchStore.focused.get()) {
      const text = await navigator.clipboard.readText().then((t) => t.trim())
      if (!text || text === searchStore.search.get()) return
      searchStore.search.set(text)
      searchStore.focused.set(false)
      searchStore.showTools.set(false)
      searchStore.selectedSuggestion.set(-1)
      searchStore.showSuggestions.set(false)
      router.push(`/search/${text}`)
    }
  })

  useEffect(() => {
    setShowCat(+Math.random().toFixed(2) < catChance)
    searchStore.focused.set(true)
    function hideOnClickOutside(e: MouseEvent) {
      if (!selfRef.current.contains(e.target as Node)) {
        searchStore.showSuggestions.set(false)
        searchStore.showTools.set(false)
      }
    }
    addEventListener('click', hideOnClickOutside)
    return () => {
      removeEventListener('click', hideOnClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!inputRef.current) return
    searchTimer.current && clearTimeout(searchTimer.current)
    if (!searchStore.search) {
      setQuerying(false)
      searchStore.response.set(undefined)
      searchStore.showSuggestions.set(false)
      return
    }
    inputRef.current.value = searchStore.search.get()
    searchTimer.current = setTimeout(() => {
      setQuerying(true)
      Promise.all([
        //
        queryBkrs(searchStore.search.get()),
        queryReverso(searchStore.search.get(), 'en-ch'),
      ]).then(([bkrsRes, reversoRes]) => {
        let res = bkrsRes ?? reversoRes ?? undefined
        if (res?.type === 'english') res = reversoRes
        setQuerying(false)
        searchStore.response.set(searchStore.search ? res : undefined)
        const suggestionsFound = searchStore.search && res ? !!findSuggestions(res) : false
        searchStore.showSuggestions.set(suggestionsFound && searchStore.focused.get())
        if (!suggestionsFound) {
          searchStore.selectedSuggestion.set(-1)
        }
      })
    }, searchTimeout * 1000)
  }, [searchSnap.search])

  useEffect(() => {
    if (searchStore.focused.get()) {
      inputRef.current?.focus()
    } else {
      inputRef.current?.blur()
    }
  }, [searchSnap.focused])

  const exact = searchSnap.response && findExact(searchSnap.response)

  return (
    <search {...props} ref={selfRef} className={clsx(props.className, 'relative block')}>
      <div className='hopper relative mb-4 rounded-full'>
        <input
          ref={inputRef}
          onFocus={() => {
            searchStore.focused.set(true)
            if (searchStore.response) searchStore.showSuggestions.set(true)
          }}
          onBlur={() => searchStore.focused.set(false)}
          spellCheck={false}
          type='text'
          onChange={(e) => {
            const input = e.target.value.trim()
            searchStore.search.set(input)
          }}
          className='w-full rounded-full bg-zinc-700/50 py-4 pl-6 pr-32 outline-pink-500/70 duration-100 focus-visible:outline-4 max-md:pr-20'
        />
        <AnimatePresence>
          {querying && (
            <motion.div initial={querying ? false : { scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className='mr-24 animate-spin self-center justify-self-end max-md:mr-14'>
              <TbLoader className='stroke-zinc-500' />
            </motion.div>
          )}
        </AnimatePresence>
        <Tooltip
          content={
            <>
              <span className='uppercase text-zinc-500'>({hotkeys.tools.display})</span> Инструменты
            </>
          }
        >
          <button
            onClick={() => {
              searchStore.showTools.set(!searchStore.showTools.get())
              searchStore.focused.set(!searchStore.showTools.get())
            }}
            className={clsx(
              'group mr-12 flex h-full items-center justify-center justify-self-end rounded-full pl-4 pr-2 duration-100  focus-visible:outline-0 disabled:opacity-50 max-md:hidden',
              searchSnap.showTools ? 'text-pink-500' : 'text-zinc-400 hover:text-pink-500 focus-visible:text-pink-500',
            )}
          >
            <TbApps className='size-5' />
          </button>
        </Tooltip>
        <button
          disabled={!!!searchSnap.search.trim()}
          onClick={() => selectSuggestion(router, searchStore.search.get())}
          className='group flex h-full items-center justify-center justify-self-end rounded-full pl-2 pr-6 text-zinc-400 duration-100 focus-visible:text-pink-500 focus-visible:outline-0 enabled:hover:text-pink-500 disabled:opacity-50'
        >
          <TbSearch className='size-4' />
        </button>
        {searchSnap.response && searchSnap.showSuggestions && !searchSnap.showTools && <Suggestions response={searchSnap.response} />}
        <AnimatePresence>
          {searchSnap.showTools && (
            <motion.div initial={{ opacity: 1, y: -2 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.1 } }} key='handwriting' exit={{ opacity: 0, y: -2, transition: { duration: 0.1 } }} className='absolute inset-x-0 top-full z-[1] mt-2 '>
              <Tools props={{}} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ul className='flex items-center justify-end gap-6 max-md:hidden'>
        {[hotkeys.focus, hotkeys.search].map(({ name, display }) => (
          <li key={name} className='flex text-xs'>
            <Article.kbd className='mx-0 mr-2 text-xs'>{display}</Article.kbd>
            {/* <kbd className='mr-2 rounded-md px-2 font-mono text-zinc-400 shadow-key'></kbd> */}
            <span className='font-mono text-zinc-500'>{name}</span>
          </li>
        ))}
      </ul>
      {showCat && (
        <Tooltip content='💋'>
          <motion.button disabled className='absolute bottom-[90%] left-[10%] max-md:bottom-[85%]'>
            <GiCat className='h-10' />
          </motion.button>
        </Tooltip>
      )}
      <AnimatePresence>{exact && searchSnap.focused && <ExactFound key={'exact'} props={{ ch: exact.ch, tr: exact.tr }} className='absolute bottom-[calc(100%+0.5rem)] w-full' />}</AnimatePresence>
    </search>
  )
}

const suggestions = {
  ch: ChSuggestions,
  ru: RuSuggestions,
  py: PySuggestions,
  'ch-long': ChLongSuggestions,
  english: undefined,
  error: undefined,
  many: ManySuggestions,
  one: OneSuggestions,
} satisfies { [T in BkrsResponseType]: ((props: BkrsResponseProps<T>) => ReactNode) | undefined } & { [T in ReversoResponseType]: ((props: ReversoResponseProps<T>) => ReactNode) | undefined }

function Suggestions(props: ResponseProps) {
  return suggestions[props.response.type]?.(props as never)
}
