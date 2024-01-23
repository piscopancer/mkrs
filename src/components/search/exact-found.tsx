'use client'

import { searchStore } from '@/search'
import { classes } from '@/utils'
import { HTMLMotionProps, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { TbArrowBadgeRightFilled } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import { selectSuggestion } from './utils'

export default function ExactFound({ found, ...htmlProps }: HTMLMotionProps<'aside'> & { found: string }) {
  const searchSnap = useSnapshot(searchStore)
  const router = useRouter()

  return (
    <motion.button
      {...htmlProps}
      exit={{ y: 2, opacity: 0 }}
      animate={{ y: 0, opacity: searchSnap.selectedSuggestion === -1 ? 1 : 0.5 }}
      initial={{ y: 2, opacity: 0 }}
      onClick={() => selectSuggestion(router, found)}
      className={classes(
        htmlProps.className,
        searchSnap.selectedSuggestion === -1 ? ' from-pink-500 to-pink-400 border-pink-200/50' : ' from-zinc-800 to-zinc-800 border-zinc-700',
        'border-2 border-transparent px-6 py-2 rounded-full flex items-center bg-gradient-to-r text-zinc-200 duration-500 transition-[scale,background] max-md:px-4 max-md:py-1'
      )}
    >
      <span className='mr-auto font-bold'>{found}</span>
      <ul className='flex items-center md:mr-6'>
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: ['-1rem', '0rem', '0.5rem', '1rem'],
              opacity: [0, 1, 1, 0],
              transition: {
                delay: 0.2 * i,
                repeat: Infinity,
                duration: 2,
                times: [0, 0.2, 0.8, 1],
              },
            }}
          >
            <TbArrowBadgeRightFilled className='h-8 max-md:h-6' />
          </motion.div>
        ))}
      </ul>
    </motion.button>
  )
}
