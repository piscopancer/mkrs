'use client'

import useShortcut from '@/hooks/use-key'
import { TWord, searchDescriptions, searchStore } from '@/search'
import { classes } from '@/utils'
import { useRouter } from 'next/navigation'
import { useSnapshot } from 'valtio'
import { selectSuggestion } from '../utils'

export default function ByWords(props: { words: TWord[] }) {
  const router = useRouter()
  const searchSnap = useSnapshot(searchStore)

  useShortcut([['ArrowLeft'], () => moveSelection(-1)], true)
  useShortcut([['ArrowRight'], () => moveSelection(1)], true)
  useShortcut([['ArrowUp'], () => (searchStore.selectedSuggestion = -1)], true)
  useShortcut([
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
        by > 0 ? (searchStore.selectedSuggestion = -1) : (searchStore.selectedSuggestion += by)
        break
      case -1:
        by > 0 ? (searchStore.selectedSuggestion = 0) : (searchStore.selectedSuggestion = props.words.length - 1)
        break
      default:
        searchStore.selectedSuggestion += by
        break
    }
    console.log(searchStore.selectedSuggestion)
  }

  return (
    <aside className='absolute inset-x-0 top-full mt-2 bg-zinc-800 p-4 rounded-3xl z-[1]'>
      <output className='text-xs mb-4 max-md:mb-2 block text-zinc-500'>{searchDescriptions['ch-long']}</output>
      <ul className='flex flex-wrap gap-1'>
        {props.words.map((word, i) => (
          <li key={i}>
            <button
              onMouseDown={() => word.ch && selectSuggestion(router, word.ch)}
              className={classes(
                searchSnap.selectedSuggestion === i && 'bg-zinc-700',
                searchSnap.search?.type && searchSnap.search.type === 'ch' && searchSnap.search.ch && searchSnap.search.ch === word.ch && '!text-pink-500',
                'text-md px-3 py-1 hover:bg-zinc-700/50 rounded-full border-2 border-zinc-700 block'
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
