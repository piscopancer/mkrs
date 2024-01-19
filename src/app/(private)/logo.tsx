'use client'

import gif0 from '@/assets/girl-dance-0.gif'
import gif1 from '@/assets/girl-dance-1.gif'
import gif2 from '@/assets/girl-dance-2.gif'
import gif3 from '@/assets/girl-dance-3.gif'
import gif4 from '@/assets/girl-dance-4.gif'
import gif5 from '@/assets/girl-dance-5.gif'
import { searchStore } from '@/components/search/store'
import useKey from '@/hooks/use-key'
import { classes, randomFromArray } from '@/utils'
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Image, { StaticImageData } from 'next/image'
import { ComponentProps, useEffect, useRef, useState } from 'react'
import { GiCompactDisc } from 'react-icons/gi'
import { useSnapshot } from 'valtio'

export default function Logo(props: ComponentProps<'div'>) {
  const [full, setFull] = useState(false)
  const [gif, setGif] = useState<null | StaticImageData>(null!)
  const searchSnap = useSnapshot(searchStore)
  const bigGifRef = useRef<HTMLDivElement | null>(null)

  const maxPxFromGif = 500
  const maxGifPxMovement = 20

  const _pxXFromGif = useMotionValue(0)
  const _pxYFromGif = useMotionValue(0)

  const bigGifGlassX = useSpring(useTransform(_pxXFromGif, [-maxPxFromGif, maxPxFromGif], [-maxGifPxMovement, maxGifPxMovement]))
  const bigGifGlassY = useSpring(useTransform(_pxYFromGif, [-maxPxFromGif, maxPxFromGif], [-maxGifPxMovement, maxGifPxMovement]))

  const bigGifX = useSpring(useTransform(_pxXFromGif, [maxPxFromGif, -maxPxFromGif], [-maxGifPxMovement / 2, maxGifPxMovement / 2]))
  const bigGifY = useSpring(useTransform(_pxYFromGif, [maxPxFromGif, -maxPxFromGif], [-maxGifPxMovement / 2, maxGifPxMovement / 2]))

  useKey([['Escape'], () => full && setFull(false)])

  useEffect(() => {
    setGif(randomFromArray([gif0, gif1, gif2, gif3, gif4, gif5]))
    function onMouseMove(e: MouseEvent) {
      if (bigGifRef.current) {
        const gifRect = bigGifRef.current.getBoundingClientRect()
        _pxXFromGif.set(e.pageX - (gifRect.x + gifRect.width / 2))
        _pxYFromGif.set(e.pageY - (gifRect.y + gifRect.height / 2))
      }
    }
    addEventListener('mousemove', onMouseMove)
    return () => removeEventListener('mousemove', onMouseMove)
  }, [])

  useEffect(() => {
    if (searchStore.focused) setFull(false)
  }, [searchSnap.focused])

  return (
    <div {...props} className={classes(props.className, 'z-[1]')}>
      {!full ? (
        <motion.div
          layout
          layoutId='logo'
          whileHover={{ scale: 1.1 }}
          whileTap={{
            scaleY: 0.9,
          }}
          onClick={() => setFull(true)}
          className='rounded-full bg-zinc-800 w-12 h-12 overflow-hidden'
        >
          <motion.div initial={{ x: gif ? 0 : -4 + 'rem' }} animate={{ x: 0 }}>
            {gif && <Image draggable={false} src={gif} alt='девчуля танцует' className='w-12 aspect-square rounded-full saturate-0 hover:saturate-100 duration-100 object-cover' />}
          </motion.div>
        </motion.div>
      ) : (
        <div onClick={() => setFull(false)} className={classes(!full && 'pointer-events-none', 'fixed inset-0 flex items-center justify-evenly')}>
          <motion.div key='bg' initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} className='absolute inset-0 bg-zinc-950' exit={{ opacity: 0, transition: { duration: 1 } }} />
          <Disc side='left' />
          <motion.div layout layoutId='logo' ref={bigGifRef} className='h-[80vh] max-md:h-[80vw] aspect-square '>
            <motion.div style={{ x: bigGifGlassX, y: bigGifGlassY }} className='w-full h-full rounded-full overflow-hidden'>
              <motion.div style={{ x: bigGifX, y: bigGifY }} className='w-full h-full '>
                {gif && <Image draggable={false} src={gif} alt='девчуля танцует' className='w-full h-full object-cover scale-110' />}
              </motion.div>
            </motion.div>
          </motion.div>
          <Disc side='right' />
        </div>
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
  }, [])

  return (
    <motion.div className='max-lg:hidden' animate={anim} exit={{ scale: 0 }}>
      <GiCompactDisc className='h-24 fill-zinc-200' />
    </motion.div>
  )
}
