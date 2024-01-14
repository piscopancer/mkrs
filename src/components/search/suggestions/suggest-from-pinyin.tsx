import { classes } from '@/utils'
import Link from 'next/link'
import { useSnapshot } from 'valtio'
import { searchStore } from '../store'
import useKey from '@/hooks/use-key'
import { useRouter } from 'next/navigation'
import { parseSuggestFromPinyin } from '@/search'

export default function SuggestFromPinyin() {
  const maxResults = 5
  const searchSnap = useSnapshot(searchStore)
  const router = useRouter()

  useKey([['ArrowUp'], () => moveSelection(-1)], true)
  useKey([['ArrowDown'], () => moveSelection(1)], true)
  useKey([
    ['Enter'],
    () => {
      console.log(searchSnap.selectedSuggestion)
      if (searchSnap.selectedSuggestion !== -1) {
        const ch = results[searchSnap.selectedSuggestion].ch
        selectSuggestion(ch)
      }
    },
  ])

  const el = document.createElement('div')
  el.innerHTML = searchSnap.resText
  const results = parseSuggestFromPinyin(el, maxResults)

  function moveSelection(by: -1 | 1) {
    const current = searchStore.selectedSuggestion
    switch (current) {
      case results.length - 1:
        by > 0 ? (searchStore.selectedSuggestion = -1) : (searchStore.selectedSuggestion += by)
        break
      case -1:
        by > 0 ? (searchStore.selectedSuggestion = 0) : (searchStore.selectedSuggestion = results.length - 1)
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
        {results.map((res, i) => {
          const isSelected = searchSnap.selectedSuggestion === i
          return (
            <button
              key={i}
              onMouseDown={() => {
                selectSuggestion(res.ch)
              }}
              className={classes(isSelected && '!bg-zinc-700', 'flex items-center gap-4 rounded-md px-2 py-1 hover:bg-zinc-700/50 w-full')}
            >
              <output className='bg-zinc-900 text-zinc-500 rounded-full shrink-0 flex items-center justify-center w-4 h-4 text-xs'>{i + 1}</output>
              <span className='text-zinc-200 text-nowrap font-bold px-1 rounded-sm hover:scale-105 duration-100 inline-block'>{res.ch}</span>
              <span className='text-sm text-nowrap'>{res.py}</span>
              <span className='text-sm text-nowrap grow-[3] overflow-hidden text-ellipsis text-left'>{res.ru}</span>
            </button>
          )
        })}
      </ul>
    </>
  )
}
