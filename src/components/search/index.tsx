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

  const router = useRouter()
  useKey([['s'], () => inputRef.current.focus()], !searchSnap.focused || undefined)
  useKey([['Escape'], () => (searchStore.focused = false)])
  useKey([
    ['Enter'],
    () => {
      if (searchSnap.focused && searchSnap.search && searchSnap.selectedSuggestion === -1) {
        router.push(`/search/${searchSnap.search}`)
        searchStore.focused = false
      }
    },
  ])

  useEffect(() => {
    searchStore.focused = true
  }, [])

  useEffect(() => {
    searchSnap.focused ? inputRef.current.focus() : inputRef.current.blur()
  }, [searchSnap.focused])

  useEffect(() => {
    inputRef.current.value = searchSnap.search
  }, [searchSnap.search])

  useEffect(() => {
    if (searchSnap.search) {
      queryCharacter(searchSnap.search).then((text) => {
        searchStore.resText = text
        const el = document.createElement('div')
        el.innerHTML = text
        searchStore.suggestion = determineSearchResult(el)
        el.remove()
      })
    } else {
      searchStore.suggestion = undefined
    }
  }, [searchSnap.search])

  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    searchStore.search = e.target.value
  }

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
    <search {...props}>
      <div className='relative flex items-center mb-2'>
        <input
          ref={inputRef}
          defaultValue={searchSnap.search}
          onFocus={() => (searchStore.focused = true)}
          onBlur={() => (searchStore.focused = false)}
          spellCheck={false}
          type='text'
          onChange={onInput}
          className='pl-4 pr-20 rounded-xl py-4 bg-transparent border-2 border-zinc-800 focus-visible:bg-zinc-950 duration-100 w-full focus-visible:outline-0'
        />
        <Link href={searchSnap.search ? `/search/${searchSnap.search}` : '/'} className='text-zinc-500 hover:text-lime-500 focus-visible:text-lime-500 absolute right-0 h-full aspect-square flex items-center justify-center rounded-xl group duration-100'>
          <TbSearch className='group-hover:scale-125 duration-100 group-focus-visible:scale-125' />
        </Link>
        {searchSnap.focused && searchSnap.suggestion && (
          <aside className='absolute inset-x-0 top-full mt-2 bg-zinc-800 p-4 rounded-lg z-[1]'>
            <output className='text-xs mb-4 block text-zinc-500'>{resultsDescriptions[searchSnap.suggestion]}</output>
            <Suggestion suggestion={searchSnap.suggestion} />
          </aside>
        )}
      </div>
      <ul className='flex items-center gap-4 justify-end'>
        {(
          [
            { key: 's', text: '— Искать' },
            { key: 'Enter', text: '➔' },
          ] as { key: string; text: string }[]
        ).map(({ key, text }) => (
          <li key={key}>
            <kbd className={classes(fonts.mono, 'rounded-md border text-sm text-zinc-500 px-1.5 border-b-2 border-zinc-800 mr-1')}>{key}</kbd>
            <span className='italic text-zinc-600'>{text}</span>
          </li>
        ))}
      </ul>
    </search>
  )
}
