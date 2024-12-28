'use client'

import { autoUpdate, flip, offset, size, useFloating } from '@floating-ui/react'
import { cubicBezier, motion, useMotionTemplate, useTime, useTransform } from 'framer-motion'
import { useRef } from 'react'
import colors from 'tailwindcss/colors'

export default function TestPage() {
  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [
      flip(),
      offset({ mainAxis: 16 }),
      size({
        padding: 16,
        apply({ availableHeight }) {
          if (refs.floating.current) {
            refs.floating.current.style.height = availableHeight + 'px'
          }
        },
      }),
    ],
  })

  const t = useTime()
  const t2 = useTransform(t, (v) => v % 3000)
  const r = useTransform(t2, [0, 3000], [0, 720], { clamp: false, ease: cubicBezier(0.1, 0.9, 0.9, 0.1) })
  const rotTr = useMotionTemplate`rotate(${r}, 0.5, 0.5)`

  // const clampedTime = useTransform(t, (v) => v % 5000)
  // const rX2 = useTransform(r, [0, 90, 180, 270, 360], [0, 100, 0, -100, 0])
  // const rY2 = useTransform(r, [0, 90, 180, 270, 360], [100, 0, -100, 0, 100])
  // const rX2T = useMotionTemplate`${rX2}%`
  // const rY2T = useMotionTemplate`${rY2}%`

  const infoRef = useRef<HTMLParagraphElement>(null!)

  // r.on('change', () => {
  // infoRef.current.textContent = `${Number.parseInt(rX2T.get())} | ${Number.parseInt(rY2T.get())}`
  // })

  return (
    <div className='mx-auto mt-24 h-[300vh] max-w-screen-md '>
      <p ref={infoRef}></p>
      <div className='h-24'>
        <svg xmlns='http://www.w3.org/2000/svg' className='size-full'>
          <defs>
            <mask id='clipper'>
              <rect className='size-full fill-white' />
              <rect className='size-[calc(100%-2px)] fill-black' ry='50%' x='1px' y='1px' />
            </mask>
            <motion.linearGradient gradientUnits='objectBoundingBox' id='yellow-red-yellow' gradientTransform={rotTr}>
              <stop offset='0%' stopColor={colors.zinc[800]} />
              <stop offset='30%' stopColor={colors.zinc[800]} />
              <stop offset='30%' stopColor={colors.zinc[200]} />
              <stop offset='70%' stopColor={colors.zinc[200]} />
              <stop offset='70%' stopColor={colors.zinc[800]} />
              <stop offset='100%' stopColor={colors.zinc[800]} />
            </motion.linearGradient>
          </defs>
          <rect className='size-full' ry='50%' fill='url(#yellow-red-yellow)' mask='url(#clipper)' />
        </svg>
      </div>
      {/* <Reverso mode='ch-en' search='看得' className='mb-[100vh]' /> */}
      {/* <div ref={refs.setReference} className='bg-rose-500 p-12' style={{}}>
        sex
      </div> */}
      {/*  */}
      {/* <div ref={refs.setFloating} className='w-48 overflow-scroll rounded-lg bg-blue-400' style={floatingStyles}>
        <ul>
          {Array.from({ length: 30 }).map((_, i) => (
            <li key={i} className='my-2 rounded-md bg-blue-300 p-2'>
              🚁
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  )
}
