'use client'

import { searchStore } from '@/search'
import { TMotionComponent } from '@/utils'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { TbArrowBadgeRightFilled } from 'react-icons/tb'
import { TExact, selectSuggestion } from './utils'

export default function ExactFound({ props, ...htmlProps }: TMotionComponent<'aside', NonNullable<TExact>>) {
  const selectedSuggestionSnap = searchStore.selectedSuggestion.use()
  const router = useRouter()
  const tr = new DOMParser().parseFromString(props.tr, 'text/html').body.textContent

  return (
    <motion.button
      {...htmlProps}
      exit={{ y: 2, opacity: 0 }}
      animate={{ y: 0, opacity: selectedSuggestionSnap === -1 ? 1 : 0.5 }}
      initial={{ y: 2, opacity: 0 }}
      onClick={() => selectSuggestion(router, props.ch)}
      className={clsx(
        htmlProps.className,
        selectedSuggestionSnap === -1 ? ' border-pink-200/50 from-pink-500 to-pink-400' : ' border-zinc-700 from-zinc-800 to-zinc-800',
        'flex items-center rounded-full border-2 border-transparent bg-gradient-to-r px-6 py-2 text-zinc-200 transition-[scale,background] duration-500 max-md:px-4 max-md:py-1',
      )}
    >
      <span className='mr-auto overflow-hidden text-ellipsis text-nowrap pr-6 font-bold opacity-80 max-md:pr-3 max-md:text-sm'>{tr}</span>
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
