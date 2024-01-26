import useShortcut from '@/hooks/use-key'
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

  useShortcut([['ArrowUp'], () => suggestions && suggestions.length > 0 && moveSelection(suggestions, -1)], true)
  useShortcut([['ArrowDown'], () => suggestions && suggestions.length > 0 && moveSelection(suggestions, 1)], true)
  useShortcut([
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
    <aside className='absolute inset-x-0 top-full mt-2 bg-zinc-800 p-4 rounded-3xl z-[1] max-md:p-3 max-md:rounded-xl'>
      <output className='text-xs mb-4 max-md:mb-2 block text-zinc-500'>{searchDescriptions[props.search.type]}</output>
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
