'use client'

import clsx from 'clsx'
import { motion, useMotionTemplate, useTime, useTransform } from 'framer-motion'
import { ComponentProps } from 'react'
import colors from 'tailwindcss/colors'

const lapTime = 2500

export default function Loading(props: ComponentProps<'svg'>) {
  const t = useTime()
  const clampedTime = useTransform(t, (v) => v % lapTime)
  const r = useTransform(clampedTime, [lapTime * 0.25, lapTime * 0.5, lapTime * 0.75], [0, 180 * 0.5, 180], { clamp: false })
  const rotTr = useMotionTemplate`rotate(${r}, 0.5, 0.5)`

  return (
    <svg {...props} className={clsx(props.className, 'pointer-events-none')}>
      <defs>
        <mask id='clipper'>
          <rect className='size-full fill-white' />
          <rect className='size-[calc(100%-4px)] fill-black' ry='50%' x='2px' y='2px' />
        </mask>
        <motion.linearGradient gradientUnits='objectBoundingBox' id='yellow-red-yellow' gradientTransform={rotTr}>
          <stop offset='0%' stopColor='transparent' />
          <stop offset='30%' stopColor='transparent' />
          <stop offset='30%' stopColor={'transparent'} />
          <stop offset='40%' stopColor={colors.pink[500]} />
          <stop offset='50%' stopColor={colors.pink[300]} />
          <stop offset='60%' stopColor={colors.pink[500]} />
          <stop offset='70%' stopColor={'transparent'} />
          <stop offset='70%' stopColor='transparent' />
          <stop offset='100%' stopColor='transparent' />
        </motion.linearGradient>
      </defs>
      <rect className='size-full' ry='50%' fill='url(#yellow-red-yellow)' mask='url(#clipper)' />
    </svg>
  )
}
