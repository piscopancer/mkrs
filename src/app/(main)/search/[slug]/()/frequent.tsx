'use client'

import clsx from 'clsx'
import { motion, useAnimationFrame, useSpring, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Dispatch, SetStateAction, useLayoutEffect, useRef, useState } from 'react'

function FrequentWords({ frequent, hoveredWord, setHoveredWord }: { frequent: string[]; hoveredWord: string | null; setHoveredWord: Dispatch<SetStateAction<string | null>> }) {
  return frequent.map((f, i) => (
    <motion.div
      onHoverStart={() => {
        setHoveredWord(f)
        // if (!qc.getQueryData(queryKeys.bkrs(f))) {
        //   qc.fetchQuery({
        //     queryKey: queryKeys.bkrs(f),
        //     queryFn() {
        //       return queryBkrs(f)
        //     },
        //   })
        // }
      }}
      onHoverEnd={() => {
        setHoveredWord(null)
      }}
      key={i}
      className={clsx('text-nowrap px-2 duration-100', hoveredWord && (f === hoveredWord ? 'scale-110' : 'opacity-50'))}
    >
      <Link href={`/search/${f}`}>{f}</Link>
    </motion.div>
  ))
}

export default function Frequent({ frequent, ...compProps }: React.ComponentProps<'div'> & { frequent: string[] }) {
  const selfRef = useRef<HTMLUListElement>(null!)
  const marquee1Ref = useRef<HTMLUListElement>(null!)
  const [selfWidth, setSelfWidth] = useState(0)
  const [marqueeWidth, setMarqueeWidth] = useState(0)
  const [hoveredWord, setHoveredWord] = useState<string | null>(null)
  const shouldScroll = marqueeWidth - selfWidth > 0
  const progress = useSpring(0, { stiffness: 300 })
  const pxPerSec = 64
  const clampedProgress = useTransform(progress, (p) => p % marqueeWidth)
  const x = useTransform(clampedProgress, (p) => -p)

  useAnimationFrame((_, delta) => {
    if (!hoveredWord) {
      progress.set(progress.get() + delta * 0.001 * pxPerSec)
    }
  })

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
