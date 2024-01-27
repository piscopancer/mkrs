import { project } from '@/project'
import { Route } from 'next'
import Link from 'next/link'
import GlobalRecent from './(private)/global-recent'
import { queryGlobalRecent } from './(private)/util'

export default async function Home() {
  const globalRecent = await queryGlobalRecent()

  return (
    <main>
      <GlobalRecent recent={globalRecent} />
      <article className='rounded-lg px-4 py-2 border-2 border-zinc-800 bg-gradient-to-r from-zinc-800/50 to-transparent'>
        <h1 className='font-display mb-1'>Впервые на сайте?</h1>
        <h2>
          Узнайте больше о {project.name} на{' '}
          <Link href={'/info' as Route} className='text-pink-500 hover:text-pink-300 duration-100'>
            этой странице
          </Link>
          .
        </h2>
      </article>
    </main>
  )
}
