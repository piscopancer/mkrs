import { classes } from '@/utils'
import Link from 'next/link'
import { useSnapshot } from 'valtio'
import { searchStore } from '../store'
import useKey from '@/hooks/use-key'
import { useRouter } from 'next/navigation'

export default function SuggestFromPinyin() {
  const maxResults = 5
  const searchSnap = useSnapshot(searchStore)
  const router = useRouter()

  const el = document.createElement('div')
  el.innerHTML = searchSnap.resText
  const results = Array.from(el.querySelectorAll('#py_table > tbody > tr'))
    .slice(0, maxResults)
    .map((row) => ({
      ch: row.querySelector('a')?.textContent || '',
      py: row.querySelector('td.py_py')?.textContent || '',
      ru: row.querySelector('td.py_ru')?.textContent || '',
    }))

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

  useKey([['ArrowUp'], () => moveSelection(-1)], true)
  useKey([['ArrowDown'], () => moveSelection(1)], true)
  useKey([
    ['Enter'],
    () => {
      console.log(searchSnap.selectedSuggestion)
      if (searchSnap.selectedSuggestion !== -1) {
        searchStore.search = results[searchSnap.selectedSuggestion].ch
        router.push(`/search/${searchStore.search}`)
        searchStore.focused = false
      }
    },
  ])

  return (
    <>
      <ul className='gap-x-4 gap-y-2'>
        {results.map((res, i) => {
          const isSelected = searchSnap.selectedSuggestion === i
          return (
            <Link
              href={`/search/${res.ch}`}
              key={i}
              // onClick={(e) => {
              //   e.preventDefault()
              //   e.stopPropagation()
              // }}
              className={classes(isSelected && 'bg-zinc-700', 'flex items-center gap-4 rounded-md px-2 py-1')}
            >
              <output className='bg-zinc-900 text-zinc-500 rounded-full shrink-0 flex items-center justify-center w-4 h-4 text-xs'>{i + 1}</output>
              <span className='text-zinc-200 text-nowrap font-bold px-1 rounded-sm hover:scale-105 duration-100 inline-block'>{res.ch}</span>
              <span className='text-sm text-nowrap'>{res.py}</span>
              <span className='text-sm text-nowrap grow-[3] overflow-hidden text-ellipsis'>{res.ru}</span>
            </Link>
          )
        })}
      </ul>
    </>
  )
}
