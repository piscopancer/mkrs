'use client'

import { animate, circInOut, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { zinc } from 'tailwindcss/colors'

const words = [
  //
  '在',
  '你',
  '头',
  '里',
  '发生',
  '一些',
  // '恶鬼',
  // '思想',
] as const

export default function TestPage() {
  const containerRef = useRef<HTMLDivElement>(null!)
  const scrollRef = useRef<HTMLDivElement>(null!)
  const [scrollWidth, setScrollWidth] = useState<number>(0)
  const xMv = useMotionValue(0)
  // const progressMv = useTransform(xMv, (x) => {
  //   return (x / scrollWidth) * -1
  // })
  const [cellWidth, setCellWidth] = useState<number | null>(null)
  const progressMv = useTransform(xMv, [0, cellWidth ? -cellWidth * words.length : 0], [0, 1], { clamp: false })
  // const wordsScrolledMv = useTransform(progressMv, (p) => {
  //   return p * words.length
  // })
  const wordsScrolledMv = useTransform(progressMv, [0, 1], [0.5, words.length - 0.5], { clamp: false })
  const debugRef = useRef<HTMLPreElement>(null!)

  useEffect(() => {
    setScrollWidth(scrollRef.current.getBoundingClientRect().width)
  }, [cellWidth])

  useEffect(() => {
    progressMv.on(
      'change',
      (v) =>
        (debugRef.current.innerHTML = JSON.stringify(
          {
            scrollW: scrollWidth.toFixed(),
            x: xMv.get().toFixed(2),
            progress: progressMv.get().toFixed(2),
            wordsScrolled: wordsScrolledMv.get().toFixed(2),
          },
          null,
          2,
        )),
    )
  }, [scrollWidth])

  return (
    <div className='mt-24 text-zinc-200'>
      <button
        onClick={() => {
          animate(progressMv, 100)
        }}
      >
        + {cellWidth}
      </button>
      <pre ref={debugRef} className='text-xs'></pre>
      <div ref={containerRef} className='relative mx-auto max-w-screen-md rounded-lg border border-zinc-800'>
        <ul className='relative z-[0] mx-auto flex h-64 justify-center' draggable={false}>
          {words.map((word, i, arr) => {
            return (
              <motion.li
                style={{
                  zIndex: useTransform(wordsScrolledMv, (scr) => {
                    if (scr > i) {
                      return 0
                    } else {
                      return -arr.length - i + 1
                    }
                  }),
                  x: useTransform(
                    wordsScrolledMv,
                    [i, i + 1],
                    [
                      144 / 2,
                      //
                      -144 / 2,
                    ],
                    { clamp: false },
                  ),
                }}
                ref={(el) => {
                  if (i === 0 && el) {
                    // setCellWidth(el.getBoundingClientRect().width)
                    setCellWidth(144)
                  }
                }}
                key={i}
                className='absolute flex h-full w-px justify-center'
              >
                <motion.article
                  style={{
                    scale: useTransform(
                      wordsScrolledMv,
                      [i - 1, i + 0.5, i + 2],
                      [
                        //
                        0.95, 1, 0.95,
                      ],
                      { ease: circInOut },
                    ),
                    x: useTransform(
                      wordsScrolledMv,
                      [i - 1.5, i + 0.5, i + 2.5],
                      [
                        //
                        -144, 0, 144,
                      ],
                      { ease: (x) => x },
                    ),
                    backgroundColor: useTransform(
                      wordsScrolledMv,
                      [i - 1.5, i + 0.5, i + 2.5],
                      [
                        //
                        zinc[900],
                        zinc[800],
                        zinc[900],
                      ],
                      { ease: (x) => x },
                    ),
                  }}
                  className='aspect-[9/16] h-full border border-zinc-800 pt-8 text-center text-4xl'
                >
                  {word}
                </motion.article>
              </motion.li>
            )
          })}
        </ul>
        {/*  */}
        <motion.aside
          ref={scrollRef}
          drag='x'
          style={{
            x: xMv,
            width: `calc(100% + ${(cellWidth ?? 0) * words.length}px)`,
          }}
          dragConstraints={containerRef}
          className='absolute left-0 top-0 z-[1] h-full'
        ></motion.aside>
      </div>
    </div>
  )
}
