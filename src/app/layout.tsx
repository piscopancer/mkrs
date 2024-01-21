import { fontVars } from '@/assets/fonts'
import logo from '@/assets/logo.png'
import '@/assets/styles/style.scss'
import { Tooltip } from '@/components/tooltip'
import { project } from '@/project'
import { classes } from '@/utils'
import type { Metadata } from 'next'
import Link from 'next/link'
import { TbBrandGithub, TbDeviceFloppy, TbHistory, TbKeyboard } from 'react-icons/tb'
import Info from './(private)/info'
import Logo from './(private)/logo'
import PageSelector from './(private)/page-selector'
import ThemeSwitch from './(private)/theme-switch'
import Store from './store'

export const metadata: Metadata = {
  title: project.name,
  description: project.description,
  openGraph: {
    title: project.name,
    description: project.description,
    images: [logo.src],
    creators: [project.creator.nickname],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ru'>
      <body className={classes(fontVars, 'font-sans text-zinc-200 bg-zinc-900')}>
        <div className='grid grid-cols-[min-content,1fr] grid-rows-[min-content,1fr] h-screen'>
          <div className='grid [grid-template-areas:"stack"] w-20 h-20'>
            <Logo className='[grid-area:stack] place-self-center' />
          </div>
          <header className=' self-center ml-4 flex items-center mr-4'>
            <span className='font-display mr-auto  '>
              МКРС <span className='text-xs text-zinc-600 ml-4'>{'//'} БКРС ПРОКСИ</span>
            </span>
            <ThemeSwitch className='mr-2' />
            <Info />
          </header>
          <nav className='px-3 flex flex-col justify-between py-6'>
            <Tooltip content='Главная' side='right' sideOffset={6}>
              <Link href={'/'} className='hover:bg-zinc-800 rounded-full py-2 flex justify-center font-bold relative'>
                <PageSelector route='/' />小
              </Link>
            </Tooltip>
            <ul className='flex flex-col gap-2'>
              <Tooltip content='Сохраненные' side='right' sideOffset={6}>
                <Link href={'/saved'} className='hover:bg-zinc-800 rounded-full py-2 flex justify-center relative'>
                  <PageSelector route='/saved' />
                  <TbDeviceFloppy className='h-6' />
                </Link>
              </Tooltip>
              <Tooltip content='Недавние' side='right' sideOffset={6}>
                <Link href={'/recent'} className='hover:bg-zinc-800 rounded-full py-2 flex justify-center relative'>
                  <PageSelector route='/recent' />
                  <TbHistory className='h-6' />
                </Link>
              </Tooltip>
              <div className='bg-zinc-800 my-2 h-1.5 w-1.5 mx-auto rounded-full' />
              <Tooltip content='Горячие клавиши' side='right' sideOffset={6}>
                <Link href={'/shortcuts'} className='hover:bg-zinc-800 rounded-full py-2 flex justify-center relative'>
                  <TbKeyboard className='h-6' />
                  <PageSelector route='/shortcuts' />
                </Link>
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
          </nav>
          <section className='border-2 border-zinc-800 px-4 mr-3 mb-3 rounded-lg overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]'>{children}</section>
        </div>
        <Store />
      </body>
    </html>
  )
}
