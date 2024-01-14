'use client'

import { fonts } from '@/assets/fonts'
import useKey from '@/hooks/use-key'
import { classes } from '@/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { TbSearch } from 'react-icons/tb'
import { TResult, TResultProps, determineSearchResult, queryCharacter, resultsDescriptions } from '@/search'
import ChWord from './suggestions/ch-word'
import PinyinNotFound from './suggestions/pinyin-not-found'
import RuWord from './suggestions/ru-word'
import SearchError from './suggestions/search-error'
import SuggestFromPinyin from './suggestions/suggest-from-pinyin'
import SuggestFromRu from './suggestions/suggest-from-ru'
import Words from './suggestions/words'
import { ref, useSnapshot } from 'valtio'
import { searchStore } from './store'

export default function Search(props: React.ComponentProps<'search'>) {
  const searchSnap = useSnapshot(searchStore)
  const inputRef = useRef<HTMLInputElement>(null!)
  const selfRef = useRef<HTMLElement>(null!)

  const router = useRouter()
  useKey([['s'], () => inputRef.current.focus()], !searchSnap.focused || undefined)
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
      if (searchStore.focused && searchStore.search && (searchStore.selectedSuggestion === -1 || (['ch-word', 'ru-word', 'words'] as (TResult | undefined)[]).includes(searchStore.suggestion))) {
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
        searchStore.suggestion = determineSearchResult(el)
        searchStore.showSuggestion = true
        el.remove()
      })
    } else {
      searchStore.suggestion = undefined
      searchStore.showSuggestion = false
    }
  }, [searchSnap.search])

  function Suggestion(props: { suggestion: TResult }) {
    return (
      {
        'ch-word': ChWord,
        'ru-word': RuWord,
        'suggest-from-pinyin': SuggestFromPinyin,
        'pinyin-not-found': PinyinNotFound,
        'suggest-from-ru': SuggestFromRu,
        words: Words,
        error: SearchError,
      } satisfies Record<TResult, () => ReactNode>
    )[props.suggestion]()
  }

  return (
    <search {...props} ref={selfRef} className={classes(props.className)}>
      <div className='relative flex items-center mb-2 bg-gradient-to-r from-pink-500 to-rose-500 p-0.5 rounded-full'>
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
          className='pl-6 pr-20 rounded-full py-4 bg-stone-800 duration-100 w-full focus-visible:outline-4 outline-rose-500/50'
        />
        <Link href={searchSnap.search ? `/search/${searchSnap.search}` : '/'} className='text-stone-400 hover:text-rose-500 focus-visible:text-rose-500 focus-visible:outline-0 absolute right-0 h-full aspect-square flex items-center justify-center rounded-full group duration-100'>
          <TbSearch className='group-hover:scale-125 duration-100 group-focus-visible:scale-125' />
        </Link>
        {searchSnap.showSuggestion && searchSnap.suggestion && (
          <aside className='absolute inset-x-0 top-full mt-2 bg-stone-800 p-4 rounded-lg z-[1]'>
            <output className='text-xs mb-4 block text-stone-500'>{resultsDescriptions[searchSnap.suggestion]}</output>
            <Suggestion suggestion={searchSnap.suggestion} />
          </aside>
        )}
      </div>
      <ul className='flex items-center gap-4 justify-end'>
        {(
          [
            { key: 's', text: 'Фокус' },
            { key: 'Enter', text: 'Поиск' },
          ] as { key: string; text: string }[]
        ).map(({ key, text }) => (
          <li key={key} className='rounded-full text-sm border-2 border-stone-800 overflow-hidden flex items-center'>
            <kbd className={classes(fonts.mono, 'text-stone-400 px-1.5 bg-stone-800 mr-2')}>{key}</kbd>
            <span className='text-stone-500 mr-2'>{text}</span>
          </li>
        ))}
      </ul>
    </search>
  )
}
