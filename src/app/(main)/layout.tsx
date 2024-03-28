import { project } from '@/project'
import type { Metadata } from 'next'
import { rootMetadata } from '../(private)'
import Search from './(private)/search'

export const metadata: Metadata = {
  ...rootMetadata,
  title: project.name,
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='mx-auto max-w-screen-lg'>
      <Search />
      {children}
    </div>
  )
}
