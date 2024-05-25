'use client'

import { Tooltip } from '@/components/tooltip'
import Vibrator from '@/components/vibrator'
import useHotkey from '@/hooks/use-hotkey'
import { hotkeys } from '@/hotkeys'
import { searchStore } from '@/search'
import { savedStore } from '@/stores/saved'
import clsx from 'clsx'
import { motion, useAnimation, useSpring, useTransform } from 'framer-motion'
import { TbDeviceFloppy, TbNorthStar } from 'react-icons/tb'
import { zinc } from 'tailwindcss/colors'
import { useSnapshot } from 'valtio'

export default function Save({ ch, ...htmlProps }: React.ComponentProps<'div'> & { ch: string }) {
  const savedSnap = useSnapshot(savedStore)
  const isSaved = !!savedSnap.saved.find((w) => w === ch)
  const savedMV = useSpring(isSaved ? 1 : 0)
  savedMV.set(isSaved ? 1 : 0)

  const star1Anim = useAnimation()
  const star2Anim = useAnimation()

  useHotkey(hotkeys.save.keys, () => !searchStore.focused && onClick())

  function onClick() {
    if (!isSaved) {
      savedStore.saved.push(ch)
      savedMV.set(1)
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
      savedMV.set(0)
    }
  }

  return (
    <div {...htmlProps} className={clsx(htmlProps.className, 'relative')}>
      <Tooltip
        content={
          <>
            <span className='uppercase text-zinc-500'>({hotkeys.save.display}) </span>
            {isSaved ? 'Убрать из сохраненных' : 'Сохранить'}
          </>
        }
      >
        <motion.button onClick={onClick} whileTap={{ scaleY: 0.9 }} transition={{ type: 'spring', stiffness: 300 }} className={clsx(isSaved ? '' : 'max-md:active:bg-zinc-800/50 md:hover:bg-zinc-800/50', 'group flex h-14 w-14 items-center justify-center rounded-full')}>
          <div className='hopper grid h-full w-full'>
            <motion.div
              style={{
                opacity: useTransform(savedMV, [0, 1], [1, 0]),
                scale: useTransform(savedMV, [0, 1], [1, 1.5]),
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              className='h-full w-full rounded-full border-2 border-zinc-800'
            />
            <motion.div
              style={{
                opacity: savedMV,
                y: useTransform(savedMV, [0, 1], [-15, 0]),
                scaleY: useTransform(savedMV, [0, 1], [0, 1.2]),
                scaleX: useTransform(savedMV, [0, 1], [1, 1.2]),
              }}
              className='place-self-center'
            >
              <TbDeviceFloppy className='h-6 w-6  stroke-pink-500 ' />
            </motion.div>
            <motion.div
              style={{
                opacity: useTransform(savedMV, [0, 1], [1, 0]),
                y: useTransform(savedMV, [0, 1], [0, 10]),
                scaleY: useTransform(savedMV, [0, 1], [1, 0]),
              }}
              className='place-self-center'
            >
              <TbDeviceFloppy className='h-6 w-6  stroke-zinc-500 ' />
            </motion.div>
            <motion.div
              style={{
                opacity: useTransform(savedMV, [0, 1], [0, 1]),
                scale: useTransform(savedMV, [0, 1], [0, 1]),
              }}
              className='h-full w-full rounded-full bg-pink-500/10'
            />
          </div>
          <Vibrator key={+isSaved} pattern={isSaved ? [50] : [80, 50, 50]} />
        </motion.button>
      </Tooltip>
      <motion.div className='pointer-events-none absolute inset-0'>
        <motion.div initial={{ scale: 0 }} animate={star1Anim} className='absolute left-[-5%] top-[-5%]'>
          <TbNorthStar className='h-6 w-6 stroke-pink-300 ' />
        </motion.div>
        <motion.div initial={{ scale: 0 }} animate={star2Anim} className='absolute bottom-0 right-[-12%]'>
          <TbNorthStar className='h-6 w-6 stroke-pink-300' />
        </motion.div>
      </motion.div>
    </div>
  )
}
