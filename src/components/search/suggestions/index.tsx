import useHotkey from '@/hooks/use-hotkey'
import { TSearch, TSearchType, findSuggestions, searchDescriptions, searchStore } from '@/search'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { useSnapshot } from 'valtio'
import { selectSuggestion } from '../utils'

export default function Suggestions<T extends TSearchType, S extends TSearch<T>, Display extends unknown>(props: {
  suggestions: number
  search: S
  display: (search: S) => Display[]
  button: (props: React.ComponentProps<'button'> & { isSelected: boolean; i: number; display: Display }) => ReactNode
}) {
  const searchSnap = useSnapshot(searchStore)
  const router = useRouter()
  // const selfAnim = useAnimation()

  // useEffect(() => {
  //   selfAnim.set({ opacity: 0.5, y: -5 })
  //   selfAnim.start({ opacity: 1, y: 0 })
  // }, [])

  const suggestions = findSuggestions(props.search)?.slice(0, props.suggestions) ?? undefined
  if (suggestions) {
    if (searchStore.selectedSuggestion > suggestions.length - 1) searchStore.selectedSuggestion = 0
  } else {
    searchStore.selectedSuggestion = -1
  }

  const display = props.display(props.search)

  useHotkey([['ArrowUp'], () => suggestions && suggestions.length > 0 && moveSelection(suggestions, -1)], { prevent: true })
  useHotkey([['ArrowDown'], () => suggestions && suggestions.length > 0 && moveSelection(suggestions, 1)], { prevent: true })
  useHotkey([
    ['Enter'],
    () => {
      if (suggestions && searchSnap.selectedSuggestion !== -1) {
        selectSuggestion(router, suggestions[searchSnap.selectedSuggestion])
      }
    },
  ])

  function moveSelection(suggestions: string[], by: -1 | 1) {
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

  if (!suggestions) return

  return (
    <aside className='absolute inset-x-0 top-full z-[1] mt-2 rounded-3xl bg-zinc-800 p-4 max-md:rounded-xl max-md:p-3'>
      <output className='mb-4 block text-xs text-zinc-500 max-md:mb-2'>{searchDescriptions[props.search.type]}</output>
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
    </aside>
  )
}
