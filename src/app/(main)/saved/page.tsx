'use client'

import { savedStore } from '@/saved'
import { motion, useAnimation } from 'framer-motion'
import Link from 'next/link'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'

export default function Saved() {
  const savedSnap = useSnapshot(savedStore)
  const selfAnim = useAnimation()

  useEffect(() => {
    selfAnim.set({ opacity: 0 })
    selfAnim.start({ opacity: 1 })
  }, [selfAnim])

  return (
    <motion.main animate={selfAnim}>
      <h1 className='text-lg font-display text-zinc-200 uppercase mb-8'>сохраненные</h1>
      <ul className=''>
        {savedSnap.saved.map((word) => (
          <li key={word}>
            <Link href={`/search/${word}`} className='text-pink-500 hover:text-pink-300 text-lg'>
              {word}
            </Link>
          </li>
        ))}
      </ul>
    </motion.main>
  )
}
