import { TResultProps, parseSuggestFromPinyin } from '@/search'
import Link from 'next/link'

export default function SuggestFromPinyin(props: TResultProps) {
  const results = parseSuggestFromPinyin(props.el)

  return (
    <>
      <ul className='grid grid-cols-[1fr,1fr,4fr] gap-x-4 gap-y-2 items-start'>
        {results.map((res, i) => (
          <li key={i} className='odd:bg-zinc-800/25 contents'>
            <Link href={`/api/search?${res.ch}`} className='text-pink-500 hover:text-pink-400 px-1 rounded-sm bg-pink-950 hover:bg-pink-900 hover:scale-105 duration-100 inline-block w-fit'>
              {res.ch}
            </Link>
            <span>{res.py}</span>
            <span className=''>{res.ru}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
