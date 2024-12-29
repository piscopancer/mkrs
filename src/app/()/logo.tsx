'use client'

import useHotkey from '@/hooks/use-hotkey'
import { searchStore } from '@/search'
import { randomFromArray } from '@/utils'
import clsx from 'clsx'
import { motion, useAnimation, useSpring, useTransform } from 'framer-motion'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { GiCompactDisc } from 'react-icons/gi'

const gifsIds = [
  '4yO6Ss9',
  'YnsEWIg',
  'gqPDi6I',
  'SxIJeGW',
  'dmfnMHh',
  'l9aisrW',
  'yvaIqI0',
  'eo85Jys',
  'fXPAKIk',
  'D4mrcZg',
  'gZjX6zm',
  'yygB55Z',
  'YaWK8k1',
  'DPl6b0Z',
  'qEiwFi8',
  '5L6l98K',
  '2dfPnmQ',
  'Vg3SuAH',
  'cmn9Rbr',
  'Jsr5vKP',
  'dpQoITM',
  'iTP4P5S',
  '6aJmsog',
  'Mxe0sDA',
  'Wzxb5aF',
  'uMa4IJy',
  'Tm2KPQ2',
]

export default function Logo(props: ComponentProps<'div'>) {
  const [full, setFull] = useState(false)
  const [gif, setGif] = useState<null | string>(null!)
  const searchFocusedSnap = searchStore.focused.use()
  const smallGifRef = useRef<HTMLDivElement | null>(null)
  const bigGifRef = useRef<HTMLDivElement | null>(null)

  const maxPxFromGif = 1000
  const maxGifPxMovement = 50

  const pxXFromGif = useSpring(0)
  const pxYFromGif = useSpring(0)

  const bigGifGlassX = useTransform(pxXFromGif, [-maxPxFromGif, maxPxFromGif], [-maxGifPxMovement, maxGifPxMovement])
  const bigGifGlassY = useTransform(pxYFromGif, [-maxPxFromGif, maxPxFromGif], [-maxGifPxMovement, maxGifPxMovement])

  const bigGifX = useTransform(pxXFromGif, [maxPxFromGif, -maxPxFromGif], [-maxGifPxMovement / 2, maxGifPxMovement / 2])
  const bigGifY = useTransform(pxYFromGif, [maxPxFromGif, -maxPxFromGif], [-maxGifPxMovement / 2, maxGifPxMovement / 2])

  useHotkey(['Escape'] as const, () => full && setFull(false))

  useEffect(() => {
    const randomGifId = randomFromArray(gifsIds)
    const gifUrl = `https://i.imgur.com/${randomGifId}.gif`
    setGif(gifUrl)
    function onMouseMove(e: MouseEvent) {
      if (bigGifRef.current) {
        const gifRect = bigGifRef.current.getBoundingClientRect()
        pxXFromGif.set(e.pageX - (gifRect.x + gifRect.width / 2))
        pxYFromGif.set(e.pageY - (gifRect.y + gifRect.height / 2))
      }
    }
    addEventListener('mousemove', onMouseMove)
    return () => removeEventListener('mousemove', onMouseMove)
  }, [])

  useEffect(() => {
    if (searchStore.focused) setFull(false)
  }, [searchFocusedSnap])

  return (
    <div {...props} className={clsx(props.className)}>
      {!full ? (
        <motion.div
          ref={smallGifRef}
          layout
          layoutId='logo'
          whileHover={{ scale: 1.1 }}
          whileTap={{
            scaleY: 0.9,
          }}
          onLayoutAnimationStart={() => {
            if (smallGifRef.current) smallGifRef.current.style.zIndex = '1'
          }}
          onLayoutAnimationComplete={() => {
            if (smallGifRef.current) smallGifRef.current.style.zIndex = '0'
          }}
          transition={{ layout: { duration: 0.3 } }}
          onClick={() => setFull(true)}
          className='relative h-12 w-12 overflow-hidden rounded-full'
        >
          <motion.div initial={{ x: gif ? 0 : -4 + 'rem' }} animate={{ x: 0 }}>
            {gif && <img fetchPriority='low' draggable={false} src={gif} alt='девчуля танцует' className='aspect-square w-12 rounded-full object-cover saturate-0 duration-100 hover:saturate-100' />}
          </motion.div>
        </motion.div>
      ) : (
        createPortal(
          <div onClick={() => setFull(false)} className={clsx(!full && 'pointer-events-none', 'fixed inset-0 flex items-center justify-evenly')}>
            <motion.div key='bg' initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} className='absolute inset-0 bg-zinc-950' exit={{ opacity: 0, transition: { duration: 1 } }} />
            <Disc side='left' />
            <motion.div layout layoutId='logo' ref={bigGifRef} className='aspect-square h-[80vh] max-md:h-[80vw] '>
              <motion.div style={{ x: bigGifGlassX, y: bigGifGlassY }} className='h-full w-full overflow-hidden rounded-full'>
                <motion.div style={{ x: bigGifX, y: bigGifY }} className='h-full w-full '>
                  {gif && <img fetchPriority='low' draggable={false} src={gif} alt='девчуля танцует' className='h-full w-full scale-110 object-cover' />}
                </motion.div>
              </motion.div>
            </motion.div>
            <Disc side='right' />
          </div>,
          document.body,
        )
      )}
    </div>
  )
}

function Disc(props: { side: 'left' | 'right' }) {
  const anim = useAnimation()

  useEffect(() => {
    anim.set({
      scale: 0.5,
      opacity: 0,
      x: { left: 20 + 'vw', right: -20 + 'vw' }[props.side],
    })
    anim.start({
      opacity: 1,
      x: 0,
    })
    anim.start({
      transition: { ease: 'circIn', repeat: Infinity, duration: 1 },
      scale: [1, 1.2, 1],
    })
    anim.start({
      transition: { ease: 'linear', repeat: Infinity, duration: 6 },
      rotate: [0, 360],
    })
  }, [anim, props.side])

  return (
    <motion.div className='max-lg:hidden' animate={anim} exit={{ scale: 0 }}>
      <GiCompactDisc className='h-24 fill-zinc-200' />
    </motion.div>
  )
}
