import { project } from '@/project'
import type { Metadata } from 'next'
import { rootMetadata } from '../()'
import Background from './()/background'
import Search from './()/search'

export const metadata: Metadata = {
  ...rootMetadata,
  title: `Главная страница — ${project.name}`,
  description: `${rootMetadata.description} Ищите слова на китайском и на русском языках, смотрите переводы с примерами на ${project.name}.`,
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Background className='absolute inset-0 overflow-hidden' />
      <div className='relative mx-auto max-w-screen-lg'>
        <Search />
        {children}
      </div>
    </>
  )
}
