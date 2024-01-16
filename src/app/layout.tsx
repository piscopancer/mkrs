import girlDancing from '@/assets/dancing-dance.gif'
import { fonts } from '@/assets/fonts'
import '@/assets/styles/style.scss'
import { Tooltip } from '@/components/tooltip'
import { project } from '@/project'
import { classes } from '@/utils'
import type { Metadata } from 'next'
import Image from 'next/image'
import { TbBookmarks, TbHistory, TbKeyboard } from 'react-icons/tb'

export const metadata: Metadata = {
  title: project.name,
  description: project.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ru'>
      <body className={classes(fonts.sans, 'text-zinc-200 bg-zinc-900')}>
        <div className='grid grid-cols-[min-content,1fr] grid-rows-[min-content,1fr] h-screen'>
          <div className='grid [grid-template-areas:"stack"] w-20 h-20'>
            <Image src={girlDancing} alt='s' className='[grid-area:stack] place-self-center w-12 aspect-square rounded-full saturate-0 hover:saturate-100 duration-100 hover:scale-110' />
            <div className='h-1/3 w-[2px] bg-zinc-700 [grid-area:stack] justify-self-end self-center' />
          </div>
          <h1 className={classes(fonts.display, 'self-center ml-4')}>
            МКРС <span className='text-xs text-zinc-600 ml-4'>// БКРС ПРОКСИ</span>
          </h1>
          <aside className='px-3 flex flex-col justify-center'>
            <ul className='flex flex-col gap-2'>
              <Tooltip content='Сохраненные' side='right' sideOffset={6}>
                <button className='hover:bg-zinc-800 rounded-full py-2 flex justify-center'>
                  <TbBookmarks className='h-6' />
                </button>
              </Tooltip>
              <Tooltip content='История' side='right' sideOffset={6}>
                <button className='hover:bg-zinc-800 rounded-full py-2 flex justify-center'>
                  <TbHistory className='h-6' />
                </button>
              </Tooltip>
              <hr className='border-zinc-700 border my-2 w-8 mx-auto' />
              <Tooltip content='Горячие клавиши' side='right' sideOffset={6}>
                <button className='hover:bg-zinc-800 rounded-full py-2 flex justify-center'>
                  <TbKeyboard className='h-6' />
                </button>
              </Tooltip>
            </ul>
          </aside>
          <section className='border-2 border-zinc-800 mr-3 mb-3 rounded-lg overflow-y-auto'>{children}</section>
        </div>
      </body>
    </html>
  )
}
