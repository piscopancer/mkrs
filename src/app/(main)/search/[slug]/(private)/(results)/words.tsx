import { TResultProps, parseWords } from '@/search'
import { stringToReact } from '..'
import Link from 'next/link'

export default function Words({ el }: TResultProps) {
  const results = parseWords(el)

  return (
    <ul className='grid grid-cols-4 gap-4'>
      {results.map((res, i) => (
        <li key={i}>
          <Link href={`/search/${res.ch}`} className='text-xl text-zinc-200 hover:text-pink-500 mb-2 block'>
            {res.ch}
          </Link>
          {res.py && <p className='mb-2 text-sm px-2 rounded-md bg-zinc-800 w-fit'>{res.py}</p>}
          <div className='text-sm [&_.m2]:ml-2 [&_.green]:text-pink-500'>{res.ru.map(stringToReact)}</div>
        </li>
      ))}
    </ul>
  )
}
