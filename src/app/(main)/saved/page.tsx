'use client'

import { savedStore } from '@/stores/saved'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import Link from 'next/link'
import { useEffect } from 'react'
import { TbX } from 'react-icons/tb'
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
      <h1 className='mb-8 font-display text-lg font-medium text-zinc-200'>Сохраненные</h1>
      <ul>
        <AnimatePresence mode='popLayout'>
          {savedSnap.saved.toReversed().map((saved) => (
            <motion.li
              key={saved}
              initial={{
                opacity: 1,
                scaleY: 1,
              }}
              exit={{
                opacity: 0.5,
                scaleY: 0,
                transition: { duration: 0.1 },
              }}
              className='group flex items-center gap-2'
              layout='position'
              transition={{
                layout: {
                  duration: 0.1,
                },
              }}
            >
              <button
                onClick={() => {
                  savedStore.saved = savedStore.saved.filter((s) => s !== saved)
                }}
                className='-ml-2 rounded-full text-zinc-500 duration-100 max-md:active:text-zinc-200 md:hover:text-zinc-200'
              >
                <TbX className='size-8 p-2' />
              </button>
              <Link href={`/search/${saved}`} className='text-lg text-pink-500 duration-100 max-md:active:text-pink-300 md:hover:text-pink-300'>
                {saved}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.main>
  )
}
