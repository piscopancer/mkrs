'use client'

import { savedStore } from '@/stores/saved'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import Link from 'next/link'
import { useEffect } from 'react'
import { TbX } from 'react-icons/tb'

export default function SavedPage() {
  // const savedSnap = useSnapshot(savedStore)
  const savedSnap = savedStore.use()
  const selfAnim = useAnimation()

  useEffect(() => {
    selfAnim.set({ opacity: 0 })
    selfAnim.start({ opacity: 1 })
  }, [selfAnim])

  return (
    <motion.main animate={selfAnim} className='mb-48'>
      <h1 className='mb-8 font-display text-xl font-medium text-zinc-200'>Сохраненные</h1>
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
              className='group/li -mx-2 flex items-center rounded-md px-2 hover:bg-zinc-800/50'
              layout='position'
              transition={{
                layout: {
                  duration: 0.1,
                },
              }}
            >
              <button
                onClick={() => {
                  savedStore.saved.set(savedStore.saved.get().filter((s) => s !== saved))
                }}
                className='group mr-4 aspect-square rounded-full p-1.5 hover:bg-zinc-900'
              >
                <TbX className='size-5' />
              </button>
              <Link prefetch={false} href={`/search/${saved}`} className='flex min-w-0 flex-1 items-center border-b border-zinc-800 py-3 group-last/li:border-0 max-md:py-4 md:text-lg'>
                {saved}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.main>
  )
}
