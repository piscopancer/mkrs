import useKey from '@/hooks/use-key'
import { TResultProps, parseSuggestFromPinyin, parseSuggestFromRu } from '@/search'
import { classes } from '@/utils'
import { useRouter } from 'next/navigation'
import { useSnapshot } from 'valtio'
import { searchStore } from '../../store'
import { ReactElement, ReactNode } from 'react'

export default function Suggest<P extends (el: Element, suggestions: number) => unknown[], S extends ReturnType<P>[number]>(props: { button: (props: React.ComponentProps<'button'> & { isSelected: boolean; i: number; parsed: S }) => ReactNode; suggestions: number; parse: P; get: (s: S) => string }) {
  const searchSnap = useSnapshot(searchStore)
  const router = useRouter()

  const el = document.createElement('div')
  el.innerHTML = searchSnap.resText
  const parsed = props.parse(el, props.suggestions)

  useKey([['ArrowUp'], () => moveSelection(-1)], true)
  useKey([['ArrowDown'], () => moveSelection(1)], true)
  useKey([
    ['Enter'],
    () => {
      console.log(searchSnap.selectedSuggestion)
      if (searchSnap.selectedSuggestion !== -1) {
        // const suggestion = results[searchSnap.selectedSuggestion].suggestion
        const suggestion = props.get(parsed[searchSnap.selectedSuggestion] as S)
        selectSuggestion(suggestion)
      }
    },
  ])

  function moveSelection(by: -1 | 1) {
    const current = searchStore.selectedSuggestion
    switch (current) {
      case parsed.length - 1:
        by > 0 ? (searchStore.selectedSuggestion = -1) : (searchStore.selectedSuggestion += by)
        break
      case -1:
        by > 0 ? (searchStore.selectedSuggestion = 0) : (searchStore.selectedSuggestion = parsed.length - 1)
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
        {Array.from({ length: props.suggestions }).map((_, i) => {
          const isSelected = searchSnap.selectedSuggestion === i
          return props.button({
            i,
            isSelected,
            key: i,
            onMouseDown: () => selectSuggestion(props.get(parsed[i] as S)),
            parsed: parsed[i] as S,
          })
        })}
      </ul>
    </>
  )
}
