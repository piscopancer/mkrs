'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

export default function PageSelector({ route, ...htmlProps }: ComponentProps<'div'> & { route: string }) {
  const path = usePathname()

  return path === route ? <motion.div layoutId='page-selector' transition={{ type: 'spring', stiffness: 300, damping: 30 }} className='absolute inset-0 rounded-full border-2 border-zinc-700' /> : null
}
