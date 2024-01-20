'use client'

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { searchStore } from '../store'
import { useRouter } from 'next/navigation'
import useKey from '@/hooks/use-key'
import { TWord } from '@/search'
import { classes } from '@/utils'
import Link from 'next/link'
import { useState } from 'react'
import { selectSuggestion } from '../utils'

export function ByWords(props: { words: TWord[] }) {
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const router = useRouter()

  useKey([['ArrowLeft'], () => moveSelection(-1)], true)
  useKey([['ArrowRight'], () => moveSelection(1)], true)
  useKey([['ArrowUp'], () => setSelectedSuggestion(-1)], true)
  useKey([
    ['Enter'],
    () => {
      if (selectedSuggestion !== -1) {
        const suggestion = props.words[selectedSuggestion]
        if (suggestion.ch) selectSuggestion(router, suggestion.ch)
      }
    },
  ])

  function moveSelection(by: -1 | 1) {
    switch (selectedSuggestion) {
      case props.words.length - 1:
        by > 0 ? setSelectedSuggestion(-1) : setSelectedSuggestion((prev) => prev + by)
        break
      case -1:
        by > 0 ? setSelectedSuggestion(0) : setSelectedSuggestion(props.words.length - 1)
        break
      default:
        setSelectedSuggestion((prev) => prev + by)
        break
    }
  }

  return (
    <ul className='flex flex-wrap gap-1'>
      {props.words.map((word, i) => (
        <li key={word.ch}>
          <Link href={`/search/${word.ch}`} className={classes(selectedSuggestion === i ? 'bg-zinc-700' : '', 'text-md px-3 py-1 hover:text-pink-300 rounded-full border-2 border-zinc-700')}>
            {word.ch}
          </Link>
        </li>
      ))}
    </ul>
  )
}
