import { searchStore } from '@/components/search/store'
import { TResultProps } from '@/search'
import Link from 'next/link'

export default function SuggestFromRu(props: TResultProps) {
  const search = props.el.querySelector('#ru_ru')!.textContent!
  const results = Array.from(props.el.querySelectorAll('#ru_from a')).map((a) => ({
    suggestion: a?.textContent,
  }))

  function cutBeginning(whole: string, length: number) {
    let firstPart = whole.slice(0, length)
    let secondPart = whole.slice(length)
    return [firstPart, secondPart] as const
  }

  return (
    <ul>
      {results.map((res, i) => {
        if (!res.suggestion) return null
        const [beginning, rest] = cutBeginning(res.suggestion, search.length)
        return (
          <li key={i}>
            <Link href={`/search/${res.suggestion}`}>
              <span className='text-zinc-200'>{beginning}</span>
              {rest}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
