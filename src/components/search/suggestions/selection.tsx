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
          className='absolute inset-0 z-[-1] bg-zinc-800'
        ></motion.div>
      )}
    </AnimatePresence>
  )
}
