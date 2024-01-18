import useKey from '@/hooks/use-key'
import { parseWordsFromPinyin, parseSuggestFromRu, TSearchProps, TSearchType, TSearches, TSearch } from '@/search'
import { classes } from '@/utils'
import { useRouter } from 'next/navigation'
import { useSnapshot } from 'valtio'
import { searchStore } from '../store'
import { ReactElement, ReactNode, useState } from 'react'

export default function Suggestions<T extends TSearchType, S extends TSearch<T>, Display extends unknown>(props: {
  button: (props: React.ComponentProps<'button'> & { isSelected: boolean; i: number; display: Display }) => ReactNode
  suggestions: number
  search: S
  get: (search: S) => string[]
  display: (search: S) => Display[]
}) {
  const searchSnap = useSnapshot(searchStore)
  const router = useRouter()

  const suggestions = props.get(props.search).slice(0, props.suggestions)
  if (searchStore.selectedSuggestion > suggestions.length - 1) searchStore.selectedSuggestion = 0

  const display = props.display(props.search)

  useKey([['ArrowUp'], () => suggestions.length > 0 && moveSelection(-1)], true)
  useKey([['ArrowDown'], () => suggestions.length > 0 && moveSelection(1)], true)
  useKey([
    ['Enter'],
    () => {
      console.log(searchSnap.selectedSuggestion)
      if (searchSnap.selectedSuggestion !== -1) {
        const suggestion = suggestions[searchSnap.selectedSuggestion]
        selectSuggestion(suggestion)
      }
    },
  ])

  function moveSelection(by: -1 | 1) {
    const current = searchStore.selectedSuggestion
    switch (current) {
      case suggestions.length - 1:
        by > 0 ? (searchStore.selectedSuggestion = -1) : (searchStore.selectedSuggestion += by)
        break
      case -1:
        by > 0 ? (searchStore.selectedSuggestion = 0) : (searchStore.selectedSuggestion = suggestions.length - 1)
        break
      default:
        searchStore.selectedSuggestion += by
        break
    }
  }

  function selectSuggestion(ch: string) {
    router.push(`/search/${ch}`)
    searchStore.focused = false
    searchStore.showSuggestion = false
  }

  return (
    <>
      <ul>
        {suggestions.map((suggestion, i) => {
          const isSelected = searchSnap.selectedSuggestion === i
          return props.button({
            i,
            isSelected,
            onMouseDown: () => selectSuggestion(suggestion),
            display: display[i],
          })
        })}
      </ul>
    </>
  )
}
