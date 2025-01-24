'use client'

import useStopwatch from '@/hooks/use-stopwatch'
import clsx from 'clsx'
import { animateValue, motion, useMotionValue, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from 'react'

function FrequentWords({ frequent, hoveredWord, setHoveredWord }: { frequent: string[]; hoveredWord: string | null; setHoveredWord: Dispatch<SetStateAction<string | null>> }) {
  return frequent.map((f, i) => (
    <motion.div
      onHoverStart={() => {
        setHoveredWord(f)
      }}
      onHoverEnd={() => {
        setHoveredWord(null)
      }}
      onClick={() => {
        setHoveredWord(f)
      }}
      key={i}
      className={clsx('text-nowrap px-2 duration-100', hoveredWord && (f === hoveredWord ? 'scale-110' : 'opacity-50'))}
    >
      <Link prefetch={false} href={`/search/${f}`}>
        {f}
      </Link>
    </motion.div>
  ))
}

const interval = 1000

export default function Frequent({ frequent, ...compProps }: React.ComponentProps<'div'> & { frequent: string[] }) {
  const selfRef = useRef<HTMLUListElement>(null!)
  const marquee1Ref = useRef<HTMLUListElement>(null!)
  const [selfWidth, setSelfWidth] = useState(0)
  const [marqueeWidth, setMarqueeWidth] = useState(0)
  const [hoveredWord, setHoveredWord] = useState<string | null>(null)
  const pxPerSec = 32
  const shouldScroll = marqueeWidth - selfWidth > 0
  const xBase = useMotionValue(0)
  const xClamped = useTransform(xBase, (v) => v % marqueeWidth)
  const x = useTransform(xClamped, (v) => -v)
  const animation = useRef<ReturnType<typeof animateValue<number>> | null>(null)

  const stopwatch = useStopwatch({
    interval,
    onInterval(time) {
      animation.current = animateValue({
        keyframes: [xBase.get(), (time / interval) * pxPerSec],
        onUpdate: xBase.set,
        duration: interval,
        ease: (v) => v,
      })
    },
  })

  useEffect(() => {
    if (hoveredWord) {
      stopwatch.stop()
      stopwatch.set((xBase.get() / pxPerSec) * interval)
      if (animation.current) {
        animation.current.pause()
      }
    } else {
      stopwatch.set((prev) => prev + interval)
      stopwatch.start()
      if (animation.current) {
        animation.current.play()
      }
    }
  }, [hoveredWord])

  useLayoutEffect(() => {
    setMarqueeWidth(marquee1Ref.current.clientWidth)
    setSelfWidth(selfRef.current.clientWidth)
    function onResize() {
      setMarqueeWidth(marquee1Ref.current.clientWidth)
      setSelfWidth(selfRef.current.clientWidth)
    }
    addEventListener('resize', onResize)
    return () => {
      removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section ref={selfRef} {...compProps} className={clsx(compProps.className, 'relative overflow-hidden')}>
      <motion.div style={{ x: shouldScroll ? x : undefined }} className={clsx('flex max-w-fit', shouldScroll ? '' : 'mx-auto')}>
        <ul ref={marquee1Ref} className={clsx('flex text-lg')}>
          <FrequentWords frequent={frequent} hoveredWord={hoveredWord} setHoveredWord={setHoveredWord} />
        </ul>
        {shouldScroll && (
          <ul className={clsx('flex text-lg')}>
            <FrequentWords frequent={frequent} hoveredWord={hoveredWord} setHoveredWord={setHoveredWord} />
          </ul>
        )}
      </motion.div>
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-900 via-transparent to-zinc-900' />
    </section>
  )
}
