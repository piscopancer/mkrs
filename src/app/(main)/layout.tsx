'use client'

import Search from '@/components/search'
import { searchStore } from '@/components/search/store'
import useKey from '@/hooks/use-key'
import { shortcuts } from '@/shortcuts'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  useKey([shortcuts['main-page'].keys, () => !searchStore.focused && router.push('/')])
  useKey([shortcuts['recent-page'].keys, () => !searchStore.focused && router.push('/recent')])
  useKey([shortcuts['saved-page'].keys, () => !searchStore.focused && router.push('/saved')])

  return (
    <div className='max-w-screen-lg mx-auto'>
      <motion.div initial={{ marginTop: 8 + 'rem' }} animate={{ marginTop: pathname === '/' ? 8 + 'rem' : 2 + 'rem', transition: { duration: 0.8, ease: [0.3, 0.9, 0, 1] } }}>
        <Search className='mb-12' />
      </motion.div>
      {children}
    </div>
  )
}
