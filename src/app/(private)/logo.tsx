'use client'

import { HTMLMotionProps, MotionProps, motion } from 'framer-motion'
import Image from 'next/image'
import girlDancing from '@/assets/dancing-dance.gif'
import { ComponentProps, useState } from 'react'
import { classes } from '@/utils'

export default function Logo(props: ComponentProps<'div'>) {
  const [full, setFull] = useState(false)

  return (
    <div {...props} className={classes(props.className, 'z-[1]')}>
      {!full ? (
        <motion.div
          layout
          layoutId='logo'
          whileTap={{
            scaleY: 0.9,
          }}
          onClick={() => setFull(true)}
        >
          <Image draggable={false} src={girlDancing} alt='девчуля танцует' className='w-12 aspect-square rounded-full saturate-0 hover:saturate-100 duration-100 hover:scale-110' />
        </motion.div>
      ) : (
        <div onClick={() => setFull(false)} className={classes(!full && 'pointer-events-none', 'fixed inset-0 flex items-center justify-center')}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} className='absolute inset-0 bg-zinc-950' />
          <motion.div layout layoutId='logo'>
            <Image draggable={false} src={girlDancing} alt='девчуля танцует' className='h-[80vh] max-md:h-[80vw] w-auto aspect-square rounded-full relative' />
          </motion.div>
        </div>
      )}
    </div>
  )
}
