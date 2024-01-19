import girlDancing from '@/assets/dancing-dance.gif'
import { fonts } from '@/assets/fonts'
import '@/assets/styles/style.scss'
import { Tooltip } from '@/components/tooltip'
import { project } from '@/project'
import { classes } from '@/utils'
import type { Metadata } from 'next'
import Image from 'next/image'
import { TbBookmarks, TbBrandGithub, TbDeviceFloppy, TbHistory, TbKeyboard } from 'react-icons/tb'
import Logo from './(private)/logo'
import Link from 'next/link'

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
            <Logo className='[grid-area:stack] place-self-center' />
          </div>
          <h1 className={classes(fonts.display, 'self-center ml-4')}>
            МКРС <span className='text-xs text-zinc-600 ml-4'>// БКРС ПРОКСИ</span>
          </h1>
          <aside className='px-3 flex flex-col justify-between py-6'>
            <Tooltip content='Главная' side='right' sideOffset={6}>
              <button className='hover:bg-zinc-800 rounded-full py-2 flex justify-center font-bold'>小</button>
            </Tooltip>
            <ul className='flex flex-col gap-2'>
              <Tooltip content='Сохраненные' side='right' sideOffset={6}>
                <button className='hover:bg-zinc-800 rounded-full py-2 flex justify-center'>
                  <TbDeviceFloppy className='h-6' />
                </button>
              </Tooltip>
              <Tooltip content='История' side='right' sideOffset={6}>
                <button className='hover:bg-zinc-800 rounded-full py-2 flex justify-center'>
                  <TbHistory className='h-6' />
                </button>
              </Tooltip>
              <div className='bg-zinc-800 my-2 h-1.5 w-1.5 mx-auto rounded-full' />
              <Tooltip content='Горячие клавиши' side='right' sideOffset={6}>
                <button className='hover:bg-zinc-800 rounded-full py-2 flex justify-center'>
                  <TbKeyboard className='h-6' />
                </button>
              </Tooltip>
            </ul>
            <Tooltip
              content={
                <>
                  Поддержите проект на <span className='text-pink-500 font-bold'>Github</span>
                </>
              }
              side='right'
              sideOffset={6}
            >
              <a href={project.links.github} className='hover:bg-zinc-800 rounded-full py-2 flex justify-center'>
                <TbBrandGithub className='h-6' />
              </a>
            </Tooltip>
          </aside>
          <section className='border-2 border-zinc-800 px-4 mr-3 mb-3 rounded-lg overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]'>{children}</section>
        </div>
      </body>
    </html>
  )
}
