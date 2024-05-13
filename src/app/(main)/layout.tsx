import { project } from '@/project'
import type { Metadata } from 'next'
import { rootMetadata } from '../()'
import Search from './()/search'

export const metadata: Metadata = {
  ...rootMetadata,
  title: `Главная страница — ${project.name}`,
  description: `${rootMetadata.description} Ищите слова на китайском и на русском языках, смотрите переводы с примерами на ${project.name}.`,
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='mx-auto max-w-screen-lg'>
      <Search />
      {children}
    </div>
  )
}
