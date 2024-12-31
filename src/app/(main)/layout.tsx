import { project } from '@/project'
import { qc } from '@/query'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import { rootMetadata } from '../()'
import Background from './()/background'
import Search from './()/search'

export const metadata: Metadata = {
  ...rootMetadata,
  title: `Главная страница — ${project.name}`,
  description: `${rootMetadata.description} Ищите слова на китайском и на русском, смотрите переводы с примерами`,
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <Background className='absolute inset-0 overflow-hidden' />
      <div className='relative mx-auto max-w-screen-lg'>
        <Search />
        {children}
      </div>
    </HydrationBoundary>
  )
}
