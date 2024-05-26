'use client'

import { type TMotionComponent } from '@/utils'
import clsx from 'clsx'
import { animate, motion, useMotionValue } from 'framer-motion'
import colors from 'tailwindcss/colors'

export default function Switch({ props, ...htmlProps }: TMotionComponent<'button', { enabled: boolean; action: (current: boolean) => Promise<boolean> | boolean }>) {
  const knobScaleYMv = useMotionValue(1)

  async function onClick() {
    await props.action(props.enabled)
  }

  return (
    <motion.button
      {...htmlProps}
      onClick={onClick}
      initial={false}
      animate={
        props.enabled
          ? {
              backgroundColor: colors.pink[500],
              x: [0, 5, 0],
              transition: {
                x: {
                  duration: 0.5,
                  times: [0.1, 0.4, 1],
                },
              },
            }
          : {
              backgroundColor: colors.zinc[800],
            }
      }
      onPointerDown={() => {
        animate(knobScaleYMv, 0.9, { type: 'spring' })
      }}
      onPointerUp={() => {
        animate(knobScaleYMv, 1, { type: 'spring' })
      }}
      className={clsx(htmlProps.className, props.enabled ? 'justify-end' : 'justify-start', 'flex h-8 w-12 rounded-full p-1')}
    >
      <motion.div
        layout
        initial={false}
        animate={{
          backgroundColor: props.enabled ? colors.pink[100] : colors.zinc[600],
        }}
        style={{
          scaleY: knobScaleYMv,
        }}
        transition={{
          layout: {
            duration: 0.1,
          },
        }}
        className={clsx('aspect-square h-6 rounded-full')}
      />
    </motion.button>
  )
}
