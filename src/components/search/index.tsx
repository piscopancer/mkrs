'use client'

import useHotkey from '@/hooks/use-hotkey'
import { TSearchProps, TSearchType, abortController, determineSearchType, findSuggestions, parse, queryCharacterClient, searchStore } from '@/search'
import { shortcuts } from '@/shortcuts'
import { classes } from '@/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { GiCat } from 'react-icons/gi'
import { TbLoader, TbSearch } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import { Tooltip } from '../tooltip'
import ExactFound from './exact-found'
import ChSuggestions from './suggestions/ch'
import ChLongSuggestions from './suggestions/ch-long'
import PySuggestions from './suggestions/py'
import RuSuggestions from './suggestions/ru'
import SearchError from './suggestions/search-error'
import { findExact, selectSuggestion } from './utils'

export default function Search(props: React.ComponentProps<'search'>) {
  const searchSnap = useSnapshot(searchStore)
  const inputRef = useRef<HTMLInputElement>(null)
  const selfRef = useRef<HTMLElement>(null!)
  const router = useRouter()
  const [querying, setQuerying] = useState(false)

  const catChance = 0.01
  const [showCat, setShowCat] = useState(false)
  useEffect(() => setShowCat(+Math.random().toFixed(2) < catChance), [])

  useHotkey([shortcuts.focus.keys, () => inputRef.current?.focus()], { prevent: !searchSnap.focused || undefined })
  useHotkey([
    ['Escape'],
    () => {
      searchStore.focused = false
      searchStore.showSuggestions = false
    },
  ])
  useHotkey([
    shortcuts.search.keys,
    () => {
      if (searchStore.focused && searchStore.inputValue && searchStore.selectedSuggestion === -1) {
        selectSuggestion(router, searchStore.inputValue)
      }
    },
  ])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = searchStore.inputValue
      query(searchStore.inputValue)
    }
  }, [searchSnap.inputValue])

  useEffect(() => {
    searchStore.focused = true
    function hideOnClickOutside(e: MouseEvent) {
      if (!selfRef.current.contains(e.target as Node)) {
        searchStore.showSuggestions = false
      }
    }
    addEventListener('click', hideOnClickOutside)
    return () => {
      removeEventListener('click', hideOnClickOutside)
    }
  }, [])

  useEffect(() => {
    if (searchStore.focused) {
      inputRef.current?.focus()
      if (searchStore.search) searchStore.showSuggestions = true
    } else {
      inputRef.current?.blur()
    }
  }, [searchSnap.focused])

  function onInput(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value.trim()
    searchStore.inputValue = input
    query(input)
  }

  function query(input: string) {
    if (input) {
      setQuerying(true)
      abortController?.abort('new query')
      queryCharacterClient(input).then((text) => {
        setQuerying(false)
        const el = document.createElement('div')
        el.innerHTML = text
        searchStore.search = parse(el, determineSearchType(el))
        el.remove()
        const suggestionsFound = !!findSuggestions(searchStore.search)
        searchStore.showSuggestions = suggestionsFound && searchStore.focused
        if (!suggestionsFound) searchStore.selectedSuggestion = -1
      })
    } else {
      abortController?.abort('empty')
      setQuerying(false)
      searchStore.search = undefined
      searchStore.showSuggestions = false
    }
  }

  const suggestions = {
    ch: ChSuggestions,
    ru: RuSuggestions,
    py: PySuggestions,
    'ch-long': ChLongSuggestions,
    error: SearchError,
  } satisfies { [T in TSearchType]: (props: TSearchProps<T>) => ReactNode }

  function Suggestions<T extends TSearchType>(props: ReturnType<typeof useSnapshot<TSearchProps<T>>>) {
    return suggestions[props.search.type](props as never)
  }

  const exact = searchSnap.search && findExact(searchSnap.search)

  return (
    <search {...props} ref={selfRef} className={classes(props.className, 'relative block')}>
      <div className='hopper relative mb-3 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 p-0.5'>
        <input
          ref={inputRef}
          onFocus={() => {
            searchStore.focused = true
          }}
          onBlur={() => (searchStore.focused = false)}
          spellCheck={false}
          type='text'
          onChange={onInput}
          className='w-full rounded-full bg-zinc-800 py-4 pl-6 pr-20 outline-pink-500/50 duration-100 focus-visible:outline-4'
        />
        <button
          disabled={!!!searchSnap.inputValue.trim()}
          onClick={() => selectSuggestion(router, searchStore.inputValue)}
          className='group absolute right-0 flex aspect-square h-full items-center justify-center rounded-full text-zinc-400 duration-100 hover:text-pink-500 focus-visible:text-pink-500 focus-visible:outline-0 disabled:opacity-50'
        >
          <TbSearch />
        </button>
        <AnimatePresence>
          {querying && (
            <motion.div initial={querying ? false : { scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className='mr-14 animate-spin self-center justify-self-end'>
              <TbLoader className='stroke-zinc-500' />
            </motion.div>
          )}
        </AnimatePresence>
        {searchSnap.search && searchSnap.showSuggestions && <Suggestions search={searchSnap.search} />}
      </div>
      <ul className='flex items-center justify-end gap-6 max-md:hidden'>
        {[shortcuts.focus, shortcuts.search].map(({ name, display }) => (
          <li key={name} className='flex text-xs'>
            <kbd className='mr-2 rounded-md px-2 font-mono text-zinc-400 shadow-[0_1px_0_2px_theme(colors.zinc.700)]'>{display[0]}</kbd>
            <span className='text-zinc-500'>{name}</span>
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
