'use client'

import { fonts } from '@/assets/fonts'
import useKey from '@/hooks/use-key'
import { store, useStoreSnapshot } from '@/store'
import { classes } from '@/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TbSearch } from 'react-icons/tb'

export default function Home() {
  const storeSnap = useStoreSnapshot()
  const router = useRouter()
  useKey([['Enter'], () => router.push(`/search/${storeSnap.search}`)])

  return (
    <main>
      <div className='relative mt-[30vh] flex items-center mb-2'>
        <input defaultValue={storeSnap.search} autoFocus spellCheck={false} type='text' onChange={(e) => (store.search = e.target.value)} className='pl-4 pr-20 rounded-xl py-4 bg-transparent border-2 border-zinc-800 focus-visible:bg-zinc-950 duration-100 w-full focus-visible:outline-0' />
        <Link href={`/search/${storeSnap.search}`} className='text-zinc-500 hover:text-lime-500 focus-visible:text-lime-500 absolute right-0 h-full aspect-square flex items-center justify-center rounded-xl group duration-100'>
          <TbSearch className='group-hover:scale-125 duration-100 group-focus-visible:scale-125' />
        </Link>
      </div>
      <aside className='text-right'>
        <kbd className={classes(fonts.mono, 'rounded-md border text-sm text-zinc-500 px-1.5  border-b-2 border-zinc-800')}>Enter</kbd>
        <span className='italic text-zinc-600'> — Поиск</span>
      </aside>
    </main>
  )
}
