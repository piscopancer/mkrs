'use client'

import useHotkey from '@/hooks/use-hotkey'
import { TWord, searchDescriptions, searchStore } from '@/search'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useSnapshot } from 'valtio'
import { selectSuggestion } from '../utils'

export default function ByWords(props: { words: TWord[] }) {
  const router = useRouter()
  const searchSnap = useSnapshot(searchStore)

  useHotkey(['ArrowLeft'], () => searchStore.selectedSuggestion !== -1 && moveSelection(-1), { prevent: searchStore.selectedSuggestion !== -1 || undefined })
  useHotkey(['ArrowRight'], () => searchStore.selectedSuggestion !== -1 && moveSelection(1), { prevent: searchStore.selectedSuggestion !== -1 || undefined })
  useHotkey(
    ['ArrowUp', 'ArrowDown'],
    () => {
      searchStore.selectedSuggestion = searchStore.selectedSuggestion === -1 ? 0 : -1
    },

    { prevent: true },
  )
  useHotkey(['Enter'], () => {
    if (searchStore.selectedSuggestion !== -1) {
      const suggestion = props.words[searchStore.selectedSuggestion]
      if (suggestion.ch) selectSuggestion(router, suggestion.ch)
    }
  })

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
    <aside className='absolute inset-x-0 top-full z-[1] mt-2 rounded-xl border-2 border-zinc-800 bg-zinc-900/90 pb-4'>
      <h1 className='mx-4 mb-2 mt-3 block font-mono text-xs text-zinc-500 max-md:mb-2'>{searchDescriptions['ch-long']}</h1>
      <ul className='mx-4 flex flex-wrap gap-1'>
        {props.words.map((word, i) => (
          <li key={i}>
            <button
              onMouseDown={() => word.ch && selectSuggestion(router, word.ch)}
              className={clsx(searchSnap.selectedSuggestion === i ? 'border-zinc-600 text-zinc-200' : 'border-zinc-800 text-zinc-400', 'text-md block border-b-2 border-dashed px-2 py-1 text-xl hover:border-zinc-600 hover:text-zinc-200')}
            >
              {word.ch}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
