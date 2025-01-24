'use client'

import { queryBkrs, queryReverso } from '@/app/actions'
import { BkrsResponseProps, BkrsResponseType } from '@/bkrs'
import * as Article from '@/components/article'
import useHotkey from '@/hooks/use-hotkey'
import { hotkeys } from '@/hotkeys'
import { queryKeys } from '@/query'
import { ReversoResponseProps, ReversoResponseType } from '@/reverso'
import { findSuggestions, ResponseProps, sanitizeSearch, searchStore } from '@/search'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { GiCat } from 'react-icons/gi'
import { TbSearch, TbTools, TbX } from 'react-icons/tb'
import { Tooltip } from '../tooltip'
import DictWord from './dict-word'
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

export default function Search(props: React.ComponentProps<'search'>) {
  const searchSnap = searchStore.use()
  const router = useRouter()
  const [showCat, setShowCat] = useState(false)
  // const [copiedText, setCopiedText] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const selfRef = useRef<HTMLElement>(null!)
  const responseQuery = useQuery({
    queryKey: queryKeys.search(searchSnap.debouncedSearch),
    async queryFn() {
      if (!searchSnap.debouncedSearch) {
        return null
      }
      return Promise.all([
        //
        queryBkrs(searchSnap.debouncedSearch),
        queryReverso(searchSnap.debouncedSearch, 'en-ch'),
      ]).then(([bkrsRes, reversoRes]) => {
        let res = bkrsRes ?? reversoRes ?? undefined
        if (res?.type === 'english') res = reversoRes
        return res
      })
    },
  })

  useHotkey(
    hotkeys.focus.keys,
    () => {
      searchStore.focused.set(true)
      if (responseQuery.data) {
        searchStore.showSuggestions.set(true)
      }
    },
    { preventDefault: !searchStore.focused.get() },
  )

  useHotkey(['Escape'], () => {
    searchStore.focused.set(false)
    searchStore.showTools.set(false)
    searchStore.showSuggestions.set(false)
  })

  useHotkey(hotkeys.search.keys, () => {
    const sanitizedSearch = sanitizeSearch(searchStore.search.get())
    if (sanitizedSearch && searchStore.selectedSuggestion.get() === -1) {
      selectSuggestion(router, sanitizedSearch)
    }
  })

  function toggleTools() {
    searchStore.showTools.set(!searchStore.showTools.get())
  }

  useHotkey(
    hotkeys.tools.keys,
    () => {
      if (!searchStore.focused.get()) toggleTools()
    },
    { preventDefault: !searchStore.focused.get() },
  )

  useHotkey(
    hotkeys.clear.keys,
    () => {
      if (!searchStore.focused.get()) {
        searchStore.search.set('')
        searchStore.focused.set(true)
      }
    },
    { preventDefault: !searchStore.focused.get() },
  )

  useHotkey(['v', 'м'], async (_, e) => {
    if (e.ctrlKey && !searchStore.focused.get()) {
      const text = await navigator.clipboard.readText()
      if (!text || text === searchStore.search.get()) return
      searchStore.search.set(text)
      searchStore.completeDebounce()
      const sanitizedSearch = sanitizeSearch(text)
      searchStore.debouncedSearch.set(sanitizedSearch)
      searchStore.focused.set(false)
      searchStore.showTools.set(false)
      searchStore.selectedSuggestion.set(-1)
      searchStore.showSuggestions.set(false)
      router.push(`/search/${sanitizedSearch}`)
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
    // function onCopy() {
    //   const selection = getSelection()
    //   if (!selection) return
    //   const text = selection.toString().trim()
    //   if (text.length) {
    //     setCopiedText(text)
    //   }
    // }
    // async function trySetLastClipboardItem() {
    //   try {
    //     const last = await navigator.clipboard.read()
    //     const s = await last[0].getType('text/plain')
    //     setCopiedText((await s.text()).trim())
    //   } catch (error) {
    //     setCopiedText(null)
    //   }
    // }
    // trySetLastClipboardItem()
    addEventListener('click', hideOnClickOutside)
    // addEventListener('copy', onCopy)
    // addEventListener('focus', trySetLastClipboardItem)
    return () => {
      removeEventListener('click', hideOnClickOutside)
      // removeEventListener('copy', onCopy)
      // removeEventListener('focus', trySetLastClipboardItem)
    }
  }, [])

  useEffect(() => {
    const suggestionsFound = searchStore.search && responseQuery.data ? !!findSuggestions(responseQuery.data) : false
    searchStore.showSuggestions.set(suggestionsFound && searchStore.focused.get())
    if (!suggestionsFound) {
      searchStore.selectedSuggestion.set(-1)
    }
  }, [responseQuery.data])

  useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.value = searchStore.search.get()
  }, [searchSnap.search])

  useEffect(() => {
    if (searchStore.focused.get()) {
      inputRef.current?.focus()
      const lastChIndex = searchStore.search.get().length
      inputRef.current?.setSelectionRange(lastChIndex, lastChIndex)
    } else {
      inputRef.current?.blur()
    }
  }, [searchSnap.focused])

  const exact = responseQuery.data && findExact(responseQuery.data)

  return (
    <search {...props} ref={selfRef} className={clsx(props.className, 'relative block')}>
      <div className='hopper relative mb-4 h-14 rounded-full'>
        <input
          ref={inputRef}
          onFocus={() => {
            searchStore.focused.set(true)
            if (responseQuery.data) searchStore.showSuggestions.set(true)
          }}
          onBlur={() => searchStore.focused.set(false)}
          autoComplete='off'
          spellCheck={false}
          type='text'
          onChange={(e) => {
            const rawText = e.target.value
            if (!rawText) {
              searchStore.showSuggestions.set(false)
            }
            searchStore.search.set(rawText)
          }}
          className={clsx('w-full rounded-full bg-zinc-700/50 py-4 pl-6 pr-[5.25rem] duration-100 focus-visible:outline-4', searchSnap.selectedSuggestion === -1 ? 'outline-pink-500/70' : 'outline-zinc-700/50')}
        />
        <DictWord searchInputRef={inputRef} className={clsx(searchSnap.search ? 'hidden' : '')} />
        <div className={clsx('hopper pointer-events-none size-full duration-200', responseQuery.isLoading ? '' : 'opacity-0 saturate-0')}>
          <div className='mx-auto h-[2px] w-1/2 animate-pulse self-start bg-gradient-to-r from-transparent via-zinc-500 to-transparent' />
          <div className='mx-auto h-[2px] w-1/2 animate-pulse self-end bg-gradient-to-r from-transparent via-zinc-500 to-transparent' />
        </div>
        <button
          tabIndex={searchSnap.search ? -1 : undefined}
          onClick={() => {
            searchStore.search.set('')
            searchStore.focused.set(true)
          }}
          className={clsx('mr-12 justify-center justify-self-end px-2 text-zinc-200 duration-100 focus-visible:outline-0', searchSnap.search ? 'opacity-100' : 'pointer-events-none opacity-0')}
        >
          <TbX className='size-5' />
        </button>
        <button
          disabled={!!!searchSnap.search.trim()}
          onClick={() => selectSuggestion(router, sanitizeSearch(searchStore.search.get()))}
          className='group flex h-full items-center justify-center justify-self-end rounded-full pl-2 pr-6 text-zinc-200 duration-100 focus-visible:outline-0 disabled:opacity-50'
        >
          <TbSearch className='size-4' />
        </button>
        {responseQuery.data && searchSnap.showSuggestions && !searchSnap.showTools && <Suggestions response={responseQuery.data} />}
        <AnimatePresence>
          {searchSnap.showTools && (
            <motion.div initial={{ opacity: 1, y: -2 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.1 } }} key='handwriting' exit={{ opacity: 0, y: -2, transition: { duration: 0.1 } }} className='absolute inset-x-0 top-full z-[1] mt-12 '>
              <Tools props={{}} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* {copiedText && (
        <aside className={clsx('hopper mx-auto w-fit rounded-lg bg-zinc-800 py-1 md:hidden')}>
          <TbArrowUp className='-mr-1 -mt-2 size-5 self-start justify-self-end rounded-full bg-zinc-800 stroke-zinc-500 p-0.5' />
          <button
            onClick={() => {
              router.push(`/search/${copiedText}`)
              searchStore.search.set(copiedText)
              searchStore.focused.set(false)
              searchStore.showSuggestions.set(false)
              setCopiedText(null)
            }}
            className='line-clamp-1 animate-pulse px-4 text-center text-sm'
          >
            {copiedText}
          </button>
        </aside>
      )} */}
      <aside className='flex items-center justify-end max-md:hidden'>
        <Tooltip
          content={
            <>
              <span className='uppercase text-zinc-500'>({hotkeys.tools.display})</span> Инструменты
            </>
          }
        >
          <button onClick={toggleTools} className={clsx('mr-4 rounded-md p-1 duration-100', searchSnap.showTools ? 'text-pink-500' : 'text-zinc-500 hover:text-zinc-200')}>
            <TbTools className='size-5' />
          </button>
        </Tooltip>
        <ul className='flex items-center gap-6'>
          {[hotkeys.focus, hotkeys.search].map(({ name, display }) => (
            <li key={name} className='flex items-center text-xs'>
              <Article.kbd className='mx-0 mr-3 translate-y-0 text-xs'>{display}</Article.kbd>
              <span className='translate-y-px font-mono text-zinc-500'>{name}</span>
            </li>
          ))}
        </ul>
      </aside>
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
