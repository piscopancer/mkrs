'use client'

import useKey from '@/hooks/use-key'
import { TSearchProps, TSearchType, abortController, determineSearchType, findSuggestions, parse, queryCharacter, searchStore } from '@/search'
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
  const inputRef = useRef<HTMLInputElement>(null!)
  const selfRef = useRef<HTMLElement>(null!)
  const router = useRouter()
  const [querying, setQuerying] = useState(false)

  const catChance = 1
  const [showCat, setShowCat] = useState(false)
  useEffect(() => setShowCat(+Math.random().toFixed(2) < catChance), [])

  useKey([shortcuts.focus.keys, () => inputRef.current.focus()], !searchSnap.focused || undefined)
  useKey([
    ['Escape'],
    () => {
      searchStore.focused = false
      searchStore.showSuggestions = false
    },
  ])
  useKey([
    shortcuts.search.keys,
    () => {
      if (searchStore.focused && searchStore.inputValue && searchStore.selectedSuggestion === -1) {
        selectSuggestion(router, searchStore.inputValue)
      }
    },
  ])

  useEffect(() => {
    searchStore.focused = true
    function hideOnClickOutside(e: MouseEvent) {
      if (!selfRef.current.contains(e.target as Node)) {
        searchStore.showSuggestions = false
      }
    }
    addEventListener('click', hideOnClickOutside)
  }, [])

  useEffect(() => {
    if (searchStore.focused) {
      inputRef.current.focus()
      if (searchStore.search) searchStore.showSuggestions = true
    } else {
      inputRef.current.blur()
    }
  }, [searchSnap.focused])

  function onInput(e: ChangeEvent<HTMLInputElement>) {
    searchStore.inputValue = e.target.value.trim()
    if (searchStore.inputValue) {
      setQuerying(true)
      abortController?.abort('new query')
      queryCharacter(searchStore.inputValue).then((text) => {
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
    <search {...props} ref={selfRef} className={classes(props.className, 'relative')}>
      <div className='relative flex items-center mb-3 bg-gradient-to-r from-pink-400 to-pink-600 p-0.5 rounded-full'>
        <input
          ref={inputRef}
          onFocus={() => {
            searchStore.focused = true
          }}
          onBlur={() => (searchStore.focused = false)}
          spellCheck={false}
          type='text'
          onChange={onInput}
          className='pl-6 pr-20 rounded-full py-4 bg-zinc-800 duration-100 w-full focus-visible:outline-4 outline-pink-500/50'
        />
        <button
          disabled={!!!searchSnap.inputValue.trim()}
          onClick={() => selectSuggestion(router, searchStore.inputValue)}
          className='text-zinc-400 hover:text-pink-500 focus-visible:text-pink-500 focus-visible:outline-0 absolute right-0 h-full aspect-square rounded-full group duration-100 grid [grid-template-areas:"stack"] disabled:opacity-50'
        >
          <AnimatePresence>
            {querying ? (
              <motion.div key={'querying'} exit={{ scale: 0.5, opacity: 0 }} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className='[grid-area:stack] place-self-center'>
                <TbLoader className='animate-spin' />
              </motion.div>
            ) : (
              <motion.div key={'!querying'} exit={{ scale: 0.5, opacity: 0 }} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className='[grid-area:stack] place-self-center'>
                <TbSearch />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        {searchSnap.search && searchSnap.showSuggestions && <Suggestions search={searchSnap.search} />}
      </div>
      <ul className='flex items-center gap-6 justify-end max-md:hidden'>
        {[shortcuts.focus, shortcuts.search].map(({ name, display }) => (
          <li key={name} className='text-xs flex'>
            <kbd className='font-mono text-zinc-400 mr-2 px-2 shadow-[0_1px_0_2px_theme(colors.zinc.700)] rounded-md'>{display[0]}</kbd>
            <span className='text-zinc-500'>{name}</span>
          </li>
        ))}
      </ul>
      {showCat && (
        <Tooltip content='💋'>
          <motion.button disabled className='absolute bottom-[90%] max-md:bottom-[85%] left-[10%]'>
            <GiCat className='h-10' />
          </motion.button>
        </Tooltip>
      )}
      <AnimatePresence>{exact && searchSnap.focused && <ExactFound key={'exact'} found={exact} className='absolute bottom-[calc(100%+0.5rem)] w-full' />}</AnimatePresence>
    </search>
  )
}
