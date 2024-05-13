import { project } from '@/project'
import { Route } from 'next'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { TbX } from 'react-icons/tb'
import { getCookie, setCookie } from '../actions'

export default async function Home() {
  const ifHideInfoBanner = await getCookie('hide-info-banner')

  return (
    <main>
      {!ifHideInfoBanner && (
        <article className='hopper rounded-lg border-2 border-zinc-800 bg-gradient-to-r from-zinc-800/50 to-transparent'>
          <div className='px-4 py-2'>
            <h1 className='mb-1 font-display'>Впервые на сайте?</h1>
            <h2>
              Узнайте больше о {project.name} на{' '}
              <Link href={'/info' as Route} className='text-pink-500 duration-100 hover:text-pink-300'>
                этой странице
              </Link>
              .
            </h2>
          </div>
          <form
            action={async () => {
              'use server'
              await setCookie('hide-info-banner', true)
              revalidatePath('/')
            }}
            className='justify-self-end'
          >
            <button type='submit' className='p-3 text-zinc-400 hover:text-zinc-200'>
              <TbX />
            </button>
          </form>
        </article>
      )}
      {/* <MemoGame /> */}
    </main>
  )
}
