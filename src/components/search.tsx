'use client'

import { fonts } from '@/assets/fonts'
import useKey from '@/hooks/use-key'
import { store, useStoreSnapshot } from '@/store'
import { classes } from '@/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { TbSearch } from 'react-icons/tb'

export default function Search(props: React.ComponentProps<'search'>) {
  const storeSnap = useStoreSnapshot()
  const inputRef = useRef<HTMLInputElement>(null!)
  const [focused, setFocused] = useState(false)
  useKey([[['s'], () => inputRef.current.focus()]], !focused || undefined)
  const router = useRouter()
  useKey([[['Enter'], () => focused && storeSnap.search && router.push(`/search/${storeSnap.search}`)]])

  useEffect(() => {
    fetch(`http://localhost:3000/api/search?ch=${store.search}`)
      .then((res) => res.text())
      .then(console.info)
  }, [store.search])

  return (
    <search {...props}>
      <div className='relative flex items-center mb-2'>
        <input
          ref={inputRef}
          defaultValue={storeSnap.search}
          autoFocus
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          spellCheck={false}
          type='text'
          onChange={(e) => (store.search = e.target.value.trim())}
          className='pl-4 pr-20 rounded-xl py-4 bg-transparent border-2 border-zinc-800 focus-visible:bg-zinc-950 duration-100 w-full focus-visible:outline-0'
        />
        <Link href={storeSnap.search ? `/search/${storeSnap.search}` : '/'} className='text-zinc-500 hover:text-lime-500 focus-visible:text-lime-500 absolute right-0 h-full aspect-square flex items-center justify-center rounded-xl group duration-100'>
          <TbSearch className='group-hover:scale-125 duration-100 group-focus-visible:scale-125' />
        </Link>
      </div>
      <ul className='flex items-center gap-4 justify-end'>
        {(
          [
            { key: 's', text: '— Искать' },
            { key: 'Enter', text: '➔' },
          ] as { key: string; text: string }[]
        ).map(({ key, text }) => (
          <li key={key}>
            <kbd className={classes(fonts.mono, 'rounded-md border text-sm text-zinc-500 px-1.5  border-b-2 border-zinc-800 mr-1')}>{key}</kbd>
            <span className='italic text-zinc-600'>{text}</span>
          </li>
        ))}
      </ul>
    </search>
  )
}
