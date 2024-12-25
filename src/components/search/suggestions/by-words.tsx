'use client'

import { Word, responsesDescriptions } from '@/bkrs'
import useHotkey from '@/hooks/use-hotkey'
import { searchStore } from '@/search'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { selectSuggestion } from '../utils'

export default function ByWords(props: { words: Word[] }) {
  const router = useRouter()
  const selectedSuggestionSnap = searchStore.selectedSuggestion.use()

  useHotkey(['ArrowLeft'], () => searchStore.selectedSuggestion.get() !== -1 && moveSelection(-1), { preventDefault: searchStore.selectedSuggestion.get() !== -1 || undefined })
  useHotkey(['ArrowRight'], () => searchStore.selectedSuggestion.get() !== -1 && moveSelection(1), { preventDefault: searchStore.selectedSuggestion.get() !== -1 || undefined })
  useHotkey(
    ['ArrowUp', 'ArrowDown'],
    () => {
      searchStore.selectedSuggestion.set(searchStore.selectedSuggestion.get() === -1 ? 0 : -1)
    },
    { preventDefault: true },
  )
  useHotkey(['Enter'], () => {
    if (searchStore.selectedSuggestion.get() !== -1) {
      const suggestion = props.words[searchStore.selectedSuggestion.get()]
      if (suggestion.ch) selectSuggestion(router, suggestion.ch)
    }
  })

  function moveSelection(by: -1 | 1) {
    switch (searchStore.selectedSuggestion.get()) {
      case props.words.length - 1:
        by > 0 ? searchStore.selectedSuggestion.set(0) : searchStore.selectedSuggestion.set((prev) => prev + by)
        break
      case 0:
        by > 0 ? searchStore.selectedSuggestion.set(1) : searchStore.selectedSuggestion.set(props.words.length - 1)
        break
      default:
        searchStore.selectedSuggestion.set((prev) => prev + by)
        break
    }
  }

  return (
    <aside className='absolute inset-x-0 top-full z-[1] mt-2 rounded-xl border-2 border-zinc-800 bg-zinc-900/90 pb-4'>
      <h1 className='mx-4 mb-2 mt-3 block font-mono text-xs text-zinc-500 max-md:mb-2'>{responsesDescriptions['ch-long']}</h1>
      <ul className='mx-4 flex flex-wrap gap-1'>
        {props.words.map((word, i) => (
          <li key={i}>
            <button
              onMouseDown={() => word.ch && selectSuggestion(router, word.ch)}
              className={clsx(selectedSuggestionSnap === i ? 'border-zinc-600 text-zinc-200' : 'border-zinc-800 text-zinc-400', 'text-md block border-b-2 border-dashed px-2 py-1 text-xl hover:border-zinc-600 hover:text-zinc-200')}
            >
              {word.ch}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
