import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { GiHeraldicSun, GiPolarStar } from 'react-icons/gi'
import { TbX } from 'react-icons/tb'
import { getCookie, setCookie } from '../actions'

export default async function Home() {
  const ifHideInfoBanner = await getCookie('hide-welcoming-banner')

  return (
    <main>
      {!ifHideInfoBanner && (
        <article className='relative mb-8 overflow-hidden rounded-lg bg-zinc-800 pb-4 pt-10 max-md:px-3 max-md:py-2'>
          <GiHeraldicSun className='absolute -bottom-[45%] left-[3%] aspect-square w-[20%] rotate-3 fill-zinc-600 max-md:w-[30%]' />
          <GiPolarStar className='absolute bottom-2 right-[30%] aspect-square w-[10%] -rotate-12 fill-zinc-700 max-md:w-[15%]' />
          <GiPolarStar className='absolute -bottom-2 right-[10%] aspect-square w-[8%] rotate-[30deg] -scale-x-100 fill-zinc-700 max-md:w-[12%]' />
          <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-800' />
          <h2 className='relative ml-[25%] text-lg max-md:ml-0 max-md:text-base'>Впервые на МКРС?</h2>
          <p className='relative ml-[25%] text-zinc-400 max-md:ml-0 max-md:text-sm'>
            Узнайте о возможностях на{' '}
            <Link href={'/info'} className='text-pink-500 duration-100 hover:text-pink-400'>
              этой странице
            </Link>
          </p>
          <form
            action={async () => {
              'use server'
              await setCookie('hide-welcoming-banner', true)
              revalidatePath('/')
            }}
            className='absolute right-0 top-0'
          >
            <button type='submit' className='text-zinc-400 hover:text-zinc-200'>
              <TbX className='size-12 p-3.5' />
            </button>
          </form>
        </article>
      )}
    </main>
  )
}
