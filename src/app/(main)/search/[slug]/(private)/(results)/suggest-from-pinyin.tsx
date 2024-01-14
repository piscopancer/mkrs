import { TResultProps } from '@/search'
import Link from 'next/link'

export default function SuggestFromPinyin(props: TResultProps) {
  const results = Array.from(props.el.querySelectorAll('#py_table > tbody > tr')).map((row) => ({
    ch: row.querySelector('a')?.textContent,
    py: row.querySelector('td.py_py')?.textContent,
    ru: row.querySelector('td.py_ru')?.textContent,
  }))

  return (
    <>
      <ul className='grid grid-cols-[1fr,1fr,4fr] gap-x-4 gap-y-2 items-start'>
        {results.map((res, i) => (
          <li key={i} className='odd:bg-zinc-800/25 contents'>
            <Link href={`/api/search?${res.ch}`} className='text-lime-500 hover:text-lime-400 px-1 rounded-sm bg-lime-950 hover:bg-lime-900 hover:scale-105 duration-100 inline-block w-fit'>
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
