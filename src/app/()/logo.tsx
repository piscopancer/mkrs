'use client'

import gif0 from '@/assets/girls/0.gif'
import gif1 from '@/assets/girls/1.gif'
import gif10 from '@/assets/girls/10.gif'
import gif11 from '@/assets/girls/11.gif'
import gif12 from '@/assets/girls/12.gif'
import gif13 from '@/assets/girls/13.gif'
import gif14 from '@/assets/girls/14.gif'
import gif15 from '@/assets/girls/15.gif'
import gif16 from '@/assets/girls/16.gif'
import gif17 from '@/assets/girls/17.gif'
import gif18 from '@/assets/girls/18.gif'
import gif19 from '@/assets/girls/19.gif'
import gif2 from '@/assets/girls/2.gif'
import gif20 from '@/assets/girls/20.gif'
import gif21 from '@/assets/girls/21.gif'
import gif22 from '@/assets/girls/22.gif'
import gif23 from '@/assets/girls/23.gif'
import gif24 from '@/assets/girls/24.gif'
import gif25 from '@/assets/girls/25.gif'
import gif26 from '@/assets/girls/26.gif'
import gif27 from '@/assets/girls/27.gif'
import gif28 from '@/assets/girls/28.gif'
import gif29 from '@/assets/girls/29.gif'
import gif3 from '@/assets/girls/3.gif'
import gif30 from '@/assets/girls/30.gif'
import gif31 from '@/assets/girls/31.gif'
import gif32 from '@/assets/girls/32.gif'
import gif4 from '@/assets/girls/4.gif'
import gif5 from '@/assets/girls/5.gif'
import gif6 from '@/assets/girls/6.gif'
import gif7 from '@/assets/girls/7.gif'
import gif8 from '@/assets/girls/8.gif'
import gif9 from '@/assets/girls/9.gif'

import useHotkey from '@/hooks/use-hotkey'
import { searchStore } from '@/search'
import { randomFromArray } from '@/utils'
import clsx from 'clsx'
import { motion, useAnimation, useSpring, useTransform } from 'framer-motion'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { GiCompactDisc } from 'react-icons/gi'
import { useSnapshot } from 'valtio'

const gifs = [gif0, gif1, gif2, gif3, gif4, gif5, gif6, gif7, gif8, gif9, gif10, gif11, gif12, gif13, gif14, gif15, gif16, gif17, gif18, gif19, gif20, gif21, gif22, gif23, gif24, gif25, gif26, gif27, gif28, gif29, gif30, gif31, gif32]

export default function Logo(props: ComponentProps<'div'>) {
  const [full, setFull] = useState(false)
  const [gif, setGif] = useState<null | string>(null!)
  const searchSnap = useSnapshot(searchStore)
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
    setGif(randomFromArray(gifs).src)
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
  }, [searchSnap.focused])

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
          className='relative h-12 w-12 overflow-hidden rounded-full bg-zinc-800'
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
