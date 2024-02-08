'use client'

import Search from '@/components/search'
import useHotkey from '@/hooks/use-hotkey'
import { searchStore } from '@/search'
import { shortcuts } from '@/shortcuts'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  useHotkey([shortcuts['main-page'].keys, () => !searchStore.focused && router.push('/')])
  useHotkey([shortcuts['recent-page'].keys, () => !searchStore.focused && router.push('/recent')])
  useHotkey([shortcuts['saved-page'].keys, () => !searchStore.focused && router.push('/saved')])

  return (
    <div className='mx-auto max-w-screen-lg'>
      <motion.div
        initial={{
          marginTop: pathname === '/' ? 'var(--mt)' : 'var(--mt-high)',
        }}
        animate={{ marginTop: pathname === '/' ? 'var(--mt)' : 'var(--mt-high)', transition: { duration: 0.8, ease: [0.3, 0.9, 0, 1] } }}
        className='max-md:[--mt-high:3rem] max-md:[--mt:5rem] md:[--mt-high:5rem] md:[--mt:8rem]'
      >
        <Search className='mb-12' />
      </motion.div>
      {children}
    </div>
  )
}
