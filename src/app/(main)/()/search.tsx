'use client'

import BaseSearch from '@/components/search'
import { ease } from '@/utils'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Search() {
  const pathname = usePathname()

  return (
    <div className='mx-auto max-w-screen-lg'>
      <motion.div
        initial={{
          marginTop: pathname === '/' ? 'var(--mt)' : 'var(--mt-high)',
        }}
        animate={{ marginTop: pathname === '/' ? 'var(--mt)' : 'var(--mt-high)', transition: { duration: 0.8, ease } }}
        className='max-md:[--mt-high:3rem] max-md:[--mt:5rem] md:[--mt-high:5rem] md:[--mt:8rem]'
      >
        <BaseSearch className='mb-12' />
      </motion.div>
    </div>
  )
}
