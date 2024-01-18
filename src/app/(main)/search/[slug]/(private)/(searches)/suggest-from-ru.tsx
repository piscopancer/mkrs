import { searchStore } from '@/components/search/store'
import { TResultProps, parseSuggestFromRu } from '@/search'
import { cutStart } from '@/utils'
import Link from 'next/link'

export default function SuggestFromRu(props: TResultProps) {
  const search = props.el.querySelector('#ru_ru')!.textContent!
  const results = parseSuggestFromRu(props.el)

  return (
    <ul>
      {results.map((res, i) => {
        if (!res.startsWith) return null
        const [beginning, rest] = cutStart(res.startsWith, search.length)
        return (
          <li key={i}>
            <Link href={`/search/${res.startsWith}`}>
              <span className='text-zinc-200'>{beginning}</span>
              {rest}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
