'use client'

import { savedStore } from '@/saved'
import { motion, useAnimation } from 'framer-motion'
import Link from 'next/link'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'

export default function SavedPage() {
  const savedSnap = useSnapshot(savedStore)
  const selfAnim = useAnimation()

  useEffect(() => {
    selfAnim.set({ opacity: 0 })
    selfAnim.start({ opacity: 1 })
  }, [selfAnim])

  return (
    <motion.main animate={selfAnim} className='mb-48'>
      <h1 className='mb-8 font-display text-lg uppercase text-zinc-200'>сохраненные</h1>
      <ul>
        {savedSnap.saved.toReversed().map((saved) => (
          <li key={saved} className='group flex items-center'>
            <Link prefetch={false} href={`/search/${saved}`} className='text-lg text-pink-500 duration-100 max-md:active:text-pink-300 md:hover:text-pink-300'>
              {saved}
            </Link>
          </li>
        ))}
      </ul>
    </motion.main>
  )
}
