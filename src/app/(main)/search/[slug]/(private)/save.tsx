'use client'

import { Tooltip } from '@/components/tooltip'
import { savedStore } from '@/saved'
import { classes } from '@/utils'
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { TbDeviceFloppy, TbNorthStar } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import { zinc } from 'tailwindcss/colors'

export default function Save({ ch, ...htmlProps }: React.ComponentProps<'div'> & { ch: string }) {
  const savedSnap = useSnapshot(savedStore)
  const isSaved = !!savedSnap.saved.find((w) => w === ch)
  const _savedMV = useMotionValue(+isSaved)
  const savedMV = useSpring(_savedMV)

  const star1Anim = useAnimation()
  const star2Anim = useAnimation()

  function onClick() {
    if (!isSaved) {
      savedStore.saved.push(ch)
      _savedMV.set(1)
      star1Anim.start({
        scale: [0, 1.2, 0],
        stroke: [zinc[500], zinc[300], zinc[500]],
      })
      star2Anim.start({
        scale: [0, 0.8, 0],
        stroke: [zinc[500], zinc[300], zinc[500]],
        transition: { delay: 0.2 },
      })
    } else {
      savedStore.saved = savedStore.saved.filter((s) => s !== ch)
      _savedMV.set(0)
    }
  }

  return (
    <div {...htmlProps} className={classes(htmlProps.className)}>
      <Tooltip content={isSaved ? 'Убрать из сохраненных' : 'Сохранить'}>
        <motion.button onClick={onClick} whileTap={{ scaleY: 0.9 }} transition={{ type: 'spring', stiffness: 300 }} className={classes('h-14 w-14 rounded-lg flex items-center justify-center group')}>
          <div className='grid [grid-template-areas:"stack"] w-full h-full'>
            <motion.div
              style={{
                opacity: useTransform(savedMV, [0, 1], [1, 0]),
                scale: useTransform(savedMV, [0, 1], [1, 1.5]),
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              className='[grid-area:stack] w-full h-full rounded-full border-2 border-zinc-800'
            />
            <motion.div
              style={{
                opacity: savedMV,
                y: useTransform(savedMV, [0, 1], [-15, 0]),
                scaleY: useTransform(savedMV, [0, 1], [0, 1.2]),
                scaleX: useTransform(savedMV, [0, 1], [1, 1.2]),
              }}
              className='[grid-area:stack] place-self-center'
            >
              <TbDeviceFloppy className='w-6 h-6  stroke-pink-500 ' />
            </motion.div>
            <motion.div
              style={{
                opacity: useTransform(savedMV, [0, 1], [1, 0]),
                y: useTransform(savedMV, [0, 1], [0, 10]),
                scaleY: useTransform(savedMV, [0, 1], [1, 0]),
              }}
              className='[grid-area:stack] place-self-center'
            >
              <TbDeviceFloppy className='w-6 h-6  stroke-zinc-500 ' />
            </motion.div>
            <motion.div
              style={{
                opacity: useTransform(savedMV, [0, 1], [0, 1]),
                scale: useTransform(savedMV, [0, 1], [0, 1]),
              }}
              className='[grid-area:stack] rounded-full w-full h-full bg-pink-500/10'
            />
          </div>
        </motion.button>
      </Tooltip>
      <motion.div className='absolute inset-0 pointer-events-none'>
        <motion.div initial={{ scale: 0 }} animate={star1Anim} className='absolute top-[-5%] left-[-5%]'>
          <TbNorthStar className='w-6 h-6 stroke-pink-300 ' />
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={star2Anim} className='absolute bottom-0 right-[-12%]'>
          <TbNorthStar className='w-6 h-6 stroke-pink-300' />
        </motion.div>
      </motion.div>
    </div>
  )
}
