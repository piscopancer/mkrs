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
    <motion.main animate={selfAnim} className='mb-48'>
      <h1 className='text-lg font-display text-zinc-200 uppercase mb-8'>сохраненные</h1>
      <ul>
        {savedSnap.saved.map((saved) => (
          <li key={saved} className='flex items-center group'>
            <Link href={`/search/${saved}`} className='text-pink-500 hover:text-pink-300 text-lg'>
              {saved}
            </Link>
            {/* <button
              onClick={() => {
                savedStore.saved = savedStore.saved.filter((s) => s !== saved)
              }}
              className={classes('invisible text-zinc-600 hover:text-zinc-400 h-8 w-8 group-hover:visible flex items-center justify-center mr-2 group py-0.5 group/button')}
            >
              <TbX className='group-hover/button:scale-110 duration-100' />
            </button> */}
          </li>
        ))}
      </ul>
    </motion.main>
  )
}
