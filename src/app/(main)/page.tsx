import { project } from '@/project'
import { getCookie } from '@/utils'
import { Route } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { TbX } from 'react-icons/tb'
import { hideInfoHint } from '../actions'

export default async function Home() {
  const hideInfoBanner = getCookie(cookies(), 'hide-info-banner')

  return (
    <main>
      {!hideInfoBanner && (
        <article className='hopper rounded-lg border-2 border-zinc-800 bg-gradient-to-r from-zinc-800/50 to-transparent'>
          <div className='px-4 py-2'>
            <h1 className='font-display mb-1'>Впервые на сайте?</h1>
            <h2>
              Узнайте больше о {project.name} на{' '}
              <Link href={'/info' as Route} className='text-pink-500 hover:text-pink-300 duration-100'>
                этой странице
              </Link>
              .
            </h2>
          </div>
          <form action={hideInfoHint} className='justify-self-end'>
            <button type='submit' className='p-3 text-zinc-400 hover:text-zinc-200'>
              <TbX />
            </button>
          </form>
        </article>
      )}
    </main>
  )
}
