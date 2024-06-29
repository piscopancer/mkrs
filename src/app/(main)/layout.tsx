import { project } from '@/project'
import fs from 'fs/promises'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { rootMetadata } from '../()'
import Background from './()/background'
import Search from './()/search'

export const metadata: Metadata = {
  ...rootMetadata,
  title: `Главная страница — ${project.name}`,
  description: `${rootMetadata.description} Ищите слова на китайском и на русском языках, смотрите переводы с примерами на ${project.name}.`,
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  await writeIp()

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

async function writeIp() {
  const h = headers()
  const ip = h.get('X-Forwarded-For')
  if (ip) {
    const content = await fs.readFile(process.cwd() + '/ips.txt')
    await fs.writeFile(process.cwd() + '/ips.txt', content + '\n' + ip)
  }
}
