'use client'

import { AnimatePresence, motion } from 'framer-motion'

export default function SuggestionSelection(props: { isSelected: boolean }) {
  return (
    <AnimatePresence>
      {props.isSelected && (
        <motion.div
          key={'selected-suggestion'}
          layout='position'
          layoutId='selected-suggestion'
          exit={{
            opacity: 0.5,
            scaleY: 0,
            transition: { duration: 0.1 },
          }}
          transition={{
            layout: { duration: 0.1 },
          }}
          className='absolute inset-0 bg-gradient-to-r from-zinc-700 via-zinc-700/20 to-transparent rounded-full z-[-1]'
        />
      )}
    </AnimatePresence>
  )
}
