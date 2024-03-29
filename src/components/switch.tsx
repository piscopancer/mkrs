'use client'

import { classes, type TMotionComponent } from '@/utils'
import { motion, useAnimation } from 'framer-motion'
import colors from 'tailwindcss/colors'

export default function Switch({ props, ...htmlProps }: TMotionComponent<'button', { enabled: boolean; switch: (current: boolean) => Promise<boolean> }>) {
  const btnAnim = useAnimation()
  const knobAnim = useAnimation()

  async function onClick() {
    const enabled = await props.switch(props.enabled)
    if (enabled) {
      btnAnim.start({
        backgroundColor: colors.pink[500],
        x: [0, 5, 0],
        transition: {
          x: {
            duration: 0.5,
            times: [0.1, 0.4, 1],
          },
        },
      })
      knobAnim.start({
        backgroundColor: colors.pink[100],
      })
    } else {
      btnAnim.start({
        backgroundColor: colors.zinc[800],
      })
      knobAnim.start({
        backgroundColor: colors.zinc[600],
      })
    }
  }

  return (
    <motion.button
      {...htmlProps}
      onClick={onClick}
      animate={btnAnim}
      style={{
        backgroundColor: props.enabled ? colors.pink[500] : colors.zinc[800],
      }}
      onPointerDown={() => {
        knobAnim.start({ scaleY: 0.8, transition: { type: 'spring' } })
      }}
      onPointerUp={() => {
        knobAnim.start({ scaleY: 1, transition: { type: 'spring' } })
      }}
      className={classes(htmlProps.className, props.enabled ? 'justify-end' : 'justify-start', 'flex h-8 w-12 rounded-full p-1')}
    >
      <motion.div
        layout
        style={{
          backgroundColor: props.enabled ? colors.pink[100] : colors.zinc[600],
        }}
        transition={{
          layout: {
            duration: 0.1,
          },
        }}
        animate={knobAnim}
        className={classes('aspect-square h-6 rounded-full')}
      />
    </motion.button>
  )
}
