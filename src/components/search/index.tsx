'use client'

import { fonts } from '@/assets/fonts'
import useKey from '@/hooks/use-key'
import { classes } from '@/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { TbSearch } from 'react-icons/tb'
import { TSearchProps, TSearchType, determineSearchType, parse, queryCharacter, resultsDescriptions } from '@/search'
import { ref, useSnapshot } from 'valtio'
import { searchStore } from './store'
import RuSuggestions from './suggestions/ru'
import PySuggestions from './suggestions/py'
import SearchError from './suggestions/search-error'
import ChSuggestions from './suggestions/ch'

export default function Search(props: React.ComponentProps<'search'>) {
  const searchSnap = useSnapshot(searchStore)
  const inputRef = useRef<HTMLInputElement>(null!)
  const selfRef = useRef<HTMLElement>(null!)
  const router = useRouter()

  useKey([['s', 'ы'], () => inputRef.current.focus()], !searchSnap.focused || undefined)
  useKey([
    ['Escape'],
    () => {
      searchStore.focused = false
      searchStore.showSuggestion = false
    },
  ])
  useKey([
    ['Enter'],
    () => {
      if (searchStore.focused && searchStore.search && searchStore.selectedSuggestion === -1) {
        router.push(`/search/${searchStore.search}`)
        searchStore.focused = false
      }
    },
  ])

  useEffect(() => {
    searchStore.focused = true
    function hideOnClickOutside(e: MouseEvent) {
      if (!selfRef.current.contains(e.target as Node)) {
        console.log('outside')
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
    error: SearchError,
  } satisfies { [T in TSearchType]: (props: TSearchProps<T>) => ReactNode }

  function Suggestion<T extends TSearchType>(props: ReturnType<typeof useSnapshot<TSearchProps<T>>>) {
    return suggestions[props.search.type](props as never)
  }

  return (
    <search {...props} ref={selfRef} className={classes(props.className)}>
      <div className='relative flex items-center mb-3 bg-gradient-to-r from-pink-500 to-rose-500 p-0.5 rounded-full'>
        <input
          ref={inputRef}
          defaultValue={searchSnap.search}
          onFocus={() => (searchStore.focused = true)}
          onBlur={() => (searchStore.focused = false)}
          spellCheck={false}
          type='text'
          onChange={(e) => {
            searchStore.search = e.target.value
          }}
          className='pl-6 pr-20 rounded-full py-4 bg-zinc-800 duration-100 w-full focus-visible:outline-4 outline-rose-500/50'
        />
        <Link href={searchSnap.search ? `/search/${searchSnap.search}` : '/'} className='text-zinc-400 hover:text-rose-500 focus-visible:text-rose-500 focus-visible:outline-0 absolute right-0 h-full aspect-square flex items-center justify-center rounded-full group duration-100'>
          <TbSearch className='group-hover:scale-125 duration-100 group-focus-visible:scale-125' />
        </Link>
        {searchSnap.showSuggestion && searchSnap.suggestion && (
          <aside className='absolute inset-x-0 top-full mt-2 bg-zinc-800 p-4 rounded-lg z-[1]'>
            <output className='text-xs mb-4 block text-zinc-500'>{resultsDescriptions[searchSnap.suggestion.type]}</output>
            <Suggestion search={searchSnap.suggestion} />
          </aside>
        )}
      </div>
      <ul className='flex items-center gap-6 justify-end'>
        {(
          [
            { key: 's', text: 'Фокус' },
            { key: 'Enter', text: 'Поиск' },
          ] as { key: string; text: string }[]
        ).map(({ key, text }) => (
          <li key={key} className='text-xs flex'>
            <kbd className={classes(fonts.mono, 'text-zinc-400 mr-2 px-2 shadow-[0_1px_0_2px_theme(colors.zinc.700)] rounded-md')}>{key}</kbd>
            <span className='text-zinc-500'>{text}</span>
          </li>
          // <li key={key} className='rounded-full text-xs border-2 border-zinc-800 overflow-hidden flex items-center leading-relaxed'>
          //   <kbd className={classes(fonts.mono, 'text-zinc-400 px-2.5 bg-zinc-800 mr-2.5')}>{key}</kbd>
          //   <span className='text-zinc-500 mr-2.5'>{text}</span>
          // </li>
        ))}
      </ul>
    </search>
  )
}
