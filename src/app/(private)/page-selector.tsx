'use client'

import { classes } from '@/utils'
import { HTMLMotionProps, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function PageSelector({ route, ...htmlProps }: HTMLMotionProps<'div'> & { route: string }) {
  const path = usePathname()

  return path === route ? <motion.div {...htmlProps} layoutId='page-selector' transition={{ type: 'spring', stiffness: 400, damping: 30 }} className={classes(htmlProps.className, 'absolute inset-0 rounded-full border-2 border-zinc-700')} /> : null
}
