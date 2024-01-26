import { fontVars } from '@/assets/fonts'
import logo from '@/assets/logo.png'
import '@/assets/styles/style.scss'
import { Tooltip } from '@/components/tooltip'
import { project } from '@/project'
import { classes } from '@/utils'
import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { TbBrandGithub, TbDeviceFloppy, TbHistory, TbInfoSquareRounded, TbKeyboard, TbLineDashed } from 'react-icons/tb'
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
    images: [{ url: logo.src }],
    siteName: project.name,
    locale: 'ru',
    url: project.url,
    creators: [project.creator.nickname],
  },
  other: {
    'yandex-verification': '83261876be5b4c8f',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ru'>
      <body className={classes(fontVars, 'font-sans text-zinc-200 bg-zinc-900 text-base')}>
        <div className='grid grid-cols-[min-content,1fr] grid-rows-[min-content,1fr] [grid-template-areas:"logo_header"_"nav_main"] max-md:[grid-template-areas:"logo_header"_"main_main"_"nav_nav"] max-md:grid-rows-[min-content,1fr,min-content] h-svh'>
          <div className='flex items-center justify-center w-20 h-20 [grid-area:logo]'>
            <Logo />
          </div>
          <header className=' self-center ml-4 max-md:ml-0 flex items-center mr-4 [grid-area:header]'>
            <Link href={'/'} className='font-display mr-auto  '>
              <span className='mr-4'>МКРС </span>
              <span className='text-xs text-zinc-600 max-md:hidden'>{'//'} БКРС ПРОКСИ</span>
            </Link>
            <ThemeSwitch className='mr-2 max-md:hidden' />
            <Tooltip content='Информация' sideOffset={6}>
              <Link href={'/info' as Route} className={classes('text-zinc-200 py-2 px-4 rounded-full p-3 flex items-center justify-center hover:bg-zinc-800')}>
                <TbInfoSquareRounded className='h-6' />
              </Link>
            </Tooltip>
          </header>
          <nav className='md:px-3 max-md:py-2 flex md:flex-col justify-between py-6 [grid-area:nav] overflow-x-hidden'>
            <Tooltip content='Главная' side='right' sideOffset={6}>
              <Link href={'/'} className='md:hover:bg-zinc-800 active:bg-zinc-800 max-md:duration-200 rounded-full py-2 flex justify-center font-bold relative max-md:flex-1 max-md:order-1'>
                <PageSelector route='/' />小
              </Link>
            </Tooltip>
            <ul className='flex flex-col gap-2 max-md:contents'>
              <Tooltip content='Сохраненные' side='right' sideOffset={6}>
                <Link href={'/saved'} className='md:hover:bg-zinc-800 active:bg-zinc-800 max-md:duration-200 rounded-full py-2 flex justify-center relative max-md:flex-1 max-md:order-2'>
                  <PageSelector route='/saved' />
                  <TbDeviceFloppy className='h-6' />
                </Link>
              </Tooltip>
              <Tooltip content='Недавние' side='right' sideOffset={6}>
                <Link href={'/recent'} className='md:hover:bg-zinc-800 active:bg-zinc-800 max-md:duration-200 rounded-full py-2 flex justify-center relative max-md:flex-1 max-md:order-0'>
                  <PageSelector route='/recent' />
                  <TbHistory className='h-6' />
                </Link>
              </Tooltip>
              <TbLineDashed className='h-8 stroke-zinc-800 max-md:hidden' />
              <Tooltip content='Горячие клавиши' side='right' sideOffset={6}>
                <Link href={'/shortcuts'} className='hover:bg-zinc-800  rounded-full py-2 flex justify-center relative max-md:hidden'>
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
              <a href={project.links.github} target='_blank' className='hover:bg-zinc-800 rounded-full py-2 flex justify-center max-md:hidden'>
                <TbBrandGithub className='h-6' />
              </a>
            </Tooltip>
          </nav>
          <section className='md:border-2 md:border-zinc-800 md:px-4 md:mr-3 md:mb-3 rounded-lg overflow-y-auto overflow-x-hidden md:[scrollbar-gutter:stable] max-md:px-4 [grid-area:main]'>{children}</section>
        </div>
        <Store />
      </body>
    </html>
  )
}
