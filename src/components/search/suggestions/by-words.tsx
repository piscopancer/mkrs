'use client'

import useHotkey from '@/hooks/use-hotkey'
import { TWord, searchDescriptions, searchStore } from '@/search'
import { classes } from '@/utils'
import { useRouter } from 'next/navigation'
import { useSnapshot } from 'valtio'
import { selectSuggestion } from '../utils'

export default function ByWords(props: { words: TWord[] }) {
  const router = useRouter()
  const searchSnap = useSnapshot(searchStore)

  useHotkey([['ArrowLeft'], () => searchStore.selectedSuggestion !== -1 && moveSelection(-1)], { prevent: searchStore.selectedSuggestion !== -1 || undefined })
  useHotkey([['ArrowRight'], () => searchStore.selectedSuggestion !== -1 && moveSelection(1)], { prevent: searchStore.selectedSuggestion !== -1 || undefined })
  useHotkey(
    [
      ['ArrowUp', 'ArrowDown'],
      () => {
        searchStore.selectedSuggestion = searchStore.selectedSuggestion === -1 ? 0 : -1
      },
    ],
    { prevent: true },
  )
  useHotkey([
    ['Enter'],
    () => {
      if (searchStore.selectedSuggestion !== -1) {
        const suggestion = props.words[searchStore.selectedSuggestion]
        if (suggestion.ch) selectSuggestion(router, suggestion.ch)
      }
    },
  ])

  function moveSelection(by: -1 | 1) {
    switch (searchStore.selectedSuggestion) {
      case props.words.length - 1:
        by > 0 ? (searchStore.selectedSuggestion = 0) : (searchStore.selectedSuggestion += by)
        break
      case 0:
        by > 0 ? (searchStore.selectedSuggestion = 1) : (searchStore.selectedSuggestion = props.words.length - 1)
        break
      default:
        searchStore.selectedSuggestion += by
        break
    }
  }

  return (
    <aside className='absolute inset-x-0 top-full z-[1] mt-2 rounded-3xl bg-zinc-800 p-4'>
      <output className='mb-4 block text-xs text-zinc-500 max-md:mb-2'>{searchDescriptions['ch-long']}</output>
      <ul className='flex flex-wrap gap-1'>
        {props.words.map((word, i) => (
          <li key={i}>
            <button
              onMouseDown={() => word.ch && selectSuggestion(router, word.ch)}
              className={classes(
                searchSnap.selectedSuggestion === i && 'bg-zinc-700',
                searchSnap.search?.type && searchSnap.search.type === 'ch' && searchSnap.search.ch && searchSnap.search.ch === word.ch && '!text-pink-500',
                'text-md block rounded-full border-2 border-zinc-700 px-3 py-1 hover:bg-zinc-700/50',
              )}
            >
              {word.ch}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
