'use client'

import { savedStore } from '@/saved'
import Link from 'next/link'
import { useSnapshot } from 'valtio'

export default function Saved() {
  const savedSnap = useSnapshot(savedStore)

  return (
    <main>
      <ul className=''>
        {savedSnap.saved.map((word) => (
          <li key={word}>
            <Link href={`/search/${word}`} className='text-pink-500 hover:text-pink-300 text-lg'>
              {word}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
