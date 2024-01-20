import useKey from '@/hooks/use-key'
import { TSearch, TSearchType } from '@/search'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { useSnapshot } from 'valtio'
import { searchStore } from '../store'
import { selectSuggestion } from '../utils'

export default function Suggestions<T extends TSearchType, S extends TSearch<T>, Display extends unknown>(props: {
  suggestions: number
  search: S
  get: (search: S) => string[]
  display: (search: S) => Display[]
  button: (props: React.ComponentProps<'button'> & { isSelected: boolean; i: number; display: Display }) => ReactNode
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
      if (searchSnap.selectedSuggestion !== -1) {
        const suggestion = suggestions[searchSnap.selectedSuggestion]
        selectSuggestion(router, suggestion)
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

  return (
    <>
      <ul>
        {suggestions.map((suggestion, i) => {
          const isSelected = searchSnap.selectedSuggestion === i
          return props.button({
            i,
            isSelected,
            onMouseDown: () => selectSuggestion(router, suggestion),
            display: display[i],
          })
        })}
      </ul>
    </>
  )
}
