'use client'

import useKey from '@/hooks/use-key'
import { TSearchProps, TSearchType, abortController, determineSearchType, parse, queryCharacter, resultsDescriptions } from '@/search'
import { shortcuts } from '@/shortcuts'
import { classes } from '@/utils'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { GiCat } from 'react-icons/gi'
import { TbSearch } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import { searchStore } from './store'
import ChSuggestions from './suggestions/ch'
import ChLongSuggestions from './suggestions/ch-long'
import PySuggestions from './suggestions/py'
import RuSuggestions from './suggestions/ru'
import SearchError from './suggestions/search-error'
import { Tooltip } from '../tooltip'
import ExactFound from './exact-found'
import { findExact, selectSuggestion } from './utils'

export default function Search(props: React.ComponentProps<'search'>) {
  const searchSnap = useSnapshot(searchStore)
  const inputRef = useRef<HTMLInputElement>(null!)
  const selfRef = useRef<HTMLElement>(null!)
  const router = useRouter()

  const catChance = 0.01
  const [showCat, setShowCat] = useState(false)
  useEffect(() => setShowCat(+Math.random().toFixed(2) < catChance), [])

  useKey([shortcuts.focus.keys, () => inputRef.current.focus()], !searchSnap.focused || undefined)
  useKey([
    ['Escape'],
    () => {
      searchStore.focused = false
      searchStore.showSuggestion = false
    },
  ])
  useKey([
    shortcuts.search.keys,
    () => {
      if (searchStore.focused && searchStore.search && searchStore.selectedSuggestion === -1) {
        selectSuggestion(router, searchStore.search)
      }
    },
  ])

  useEffect(() => {
    searchStore.focused = true
    function hideOnClickOutside(e: MouseEvent) {
      if (!selfRef.current.contains(e.target as Node)) {
        searchStore.showSuggestion = false
      }
    }
    addEventListener('click', hideOnClickOutside)
  }, [])

  useEffect(() => {
    if (searchStore.focused) {
      inputRef.current.focus()
      if (searchStore.suggestion) searchStore.showSuggestion = true
    } else {
      inputRef.current.blur()
    }
  }, [searchSnap.focused])

  useEffect(() => {
    inputRef.current.value = searchStore.search
  }, [searchSnap.search])

  useEffect(() => {
    if (searchStore.search) {
      abortController?.abort('new query')
      queryCharacter(searchStore.search).then((text) => {
        searchStore.resText = text
        const el = document.createElement('div')
        el.innerHTML = text
        searchStore.suggestion = parse(el, determineSearchType(el))
        searchStore.showSuggestion = true
        el.remove()
      })
    } else {
      searchStore.suggestion = undefined
      searchStore.showSuggestion = false
    }
  }, [searchSnap.search])

  const suggestions = {
    ch: ChSuggestions,
    ru: RuSuggestions,
    py: PySuggestions,
    'ch-long': ChLongSuggestions,
    error: SearchError,
  } satisfies { [T in TSearchType]: (props: TSearchProps<T>) => ReactNode }

  function Suggestion<T extends TSearchType>(props: ReturnType<typeof useSnapshot<TSearchProps<T>>>) {
    return suggestions[props.search.type](props as never)
  }

  const exact = searchSnap.suggestion && findExact(searchSnap.suggestion)

  return (
    <search {...props} ref={selfRef} className={classes(props.className, 'relative')}>
      <div className='relative flex items-center mb-3 bg-gradient-to-r from-pink-400 to-pink-600 p-0.5 rounded-full'>
        <input
          ref={inputRef}
          defaultValue={searchSnap.search}
          onFocus={() => (searchStore.focused = true)}
          onBlur={() => (searchStore.focused = false)}
          spellCheck={false}
          type='text'
          onChange={(e) => {
            searchStore.search = e.target.value
            if (!e.target.value.trim()) {
              searchStore.suggestion = undefined
              searchStore.showSuggestion = false
            }
          }}
          className='pl-6 pr-20 rounded-full py-4 bg-zinc-800 duration-100 w-full focus-visible:outline-4 outline-pink-500/50'
        />
        <Link href={searchSnap.search ? `/search/${searchSnap.search}` : '/'} className='text-zinc-400 hover:text-pink-500 focus-visible:text-pink-500 focus-visible:outline-0 absolute right-0 h-full aspect-square flex items-center justify-center rounded-full group duration-100'>
          <TbSearch className='group-hover:scale-125 duration-100 group-focus-visible:scale-125' />
        </Link>
        <AnimatePresence>
          {searchSnap.showSuggestion && searchSnap.suggestion && (
            <motion.aside initial={{ opacity: 0.5, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className='absolute inset-x-0 top-full mt-2 bg-zinc-800 p-4 rounded-3xl z-[1]'>
              <output className='text-xs mb-4 block text-zinc-500'>{resultsDescriptions[searchSnap.suggestion.type]}</output>
              <Suggestion search={searchSnap.suggestion} />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
      <ul className='flex items-center gap-6 justify-end'>
        {[shortcuts.focus, shortcuts.search].map(({ name, display }) => (
          <li key={name} className='text-xs flex'>
            <kbd className='font-mono text-zinc-400 mr-2 px-2 shadow-[0_1px_0_2px_theme(colors.zinc.700)] rounded-md'>{display[0]}</kbd>
            <span className='text-zinc-500'>{name}</span>
          </li>
        ))}
      </ul>
      {showCat && (
        <Tooltip content='💋'>
          <motion.button disabled className='absolute bottom-[90%] left-[10%]'>
            <GiCat className='h-10' />
          </motion.button>
        </Tooltip>
      )}
      <AnimatePresence>{exact && searchSnap.showSuggestion && <ExactFound key={'exact'} found={exact} className='absolute bottom-[calc(100%+0.5rem)] w-full' />}</AnimatePresence>
    </search>
  )
}
