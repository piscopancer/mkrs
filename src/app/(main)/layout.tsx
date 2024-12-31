import { project } from '@/project'
import type { Metadata } from 'next'
import { rootMetadata } from '../()'
import Background from './()/background'
import Search from './()/search'
import { getRandomDictionaryWords } from './actions'

export const metadata: Metadata = {
  ...rootMetadata,
  title: `Главная страница — ${project.name}`,
  description: `${rootMetadata.description} Ищите слова на китайском и на русском, смотрите переводы с примерами`,
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const randomDictionaryWords = await getRandomDictionaryWords()

  return (
    <>
      <Background className='absolute inset-0 overflow-hidden' />
      <div className='relative mx-auto max-w-screen-lg'>
        <p>{randomDictionaryWords.join(', ')}</p>
        <Search />
        {children}
      </div>
    </>
  )
}
