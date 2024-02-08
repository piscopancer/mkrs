import { fontVars } from '@/assets/fonts'
import logo from '@/assets/logo.png'
import '@/assets/styles/style.scss'
import { Tooltip } from '@/components/tooltip'
import { project } from '@/project'
import { classes } from '@/utils'
import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { TbBrandGithub, TbDeviceFloppy, TbHistory, TbInfoSquareRounded, TbKeyboard, TbLineDashed } from 'react-icons/tb'
import Vibrator from '../components/vibrator'
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
    'yandex-verification': '80460a4d9f477d0e',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ru'>
      <body className={classes(fontVars, 'bg-zinc-900 font-sans text-base text-zinc-200')}>
        <div className='grid h-svh grid-cols-[min-content,1fr] grid-rows-[min-content,1fr] [grid-template-areas:"logo_header"_"nav_main"] max-md:grid-rows-[min-content,1fr,min-content] max-md:[grid-template-areas:"logo_header"_"main_main"_"nav_nav"]'>
          <div className='flex h-20 w-20 items-center justify-center [grid-area:logo]'>
            <Logo />
          </div>
          <header className=' ml-4 mr-4 flex items-center self-center [grid-area:header] max-md:ml-0'>
            <Link href={'/'} className='mr-auto font-display'>
              <span className='mr-4'>МКРС </span>
              <span className='text-xs text-zinc-600 max-md:hidden'>{'//'} БКРС ПРОКСИ</span>
            </Link>
            <ThemeSwitch className='mr-2 max-md:hidden' />
            <Tooltip content='Информация' sideOffset={6}>
              <Link href={'/info' as Route} className={classes('flex items-center justify-center rounded-full p-3 px-4 py-2 text-zinc-200 hover:bg-zinc-800')}>
                <TbInfoSquareRounded className='h-6' />
              </Link>
            </Tooltip>
          </header>
          <nav className='flex justify-between overflow-x-hidden py-6 [grid-area:nav] max-md:py-2 md:flex-col md:px-3'>
            <Tooltip content='Главная' side='right' sideOffset={6}>
              <Link href={'/'} className='relative flex justify-center rounded-full py-2 font-bold active:bg-zinc-800 max-md:order-1 max-md:flex-1 max-md:duration-200 md:hover:bg-zinc-800'>
                <PageSelector route='/' />小
                <Vibrator />
              </Link>
            </Tooltip>
            <ul className='flex flex-col gap-2 max-md:contents'>
              <Tooltip content='Сохраненные' side='right' sideOffset={6}>
                <Link href={'/saved'} className='relative flex justify-center rounded-full py-2 active:bg-zinc-800 max-md:order-2 max-md:flex-1 max-md:duration-200 md:hover:bg-zinc-800'>
                  <PageSelector route='/saved' />
                  <TbDeviceFloppy className='h-6' />
                  <Vibrator />
                </Link>
              </Tooltip>
              <Tooltip content='Недавние' side='right' sideOffset={6}>
                <Link href={'/recent'} className='max-md:order-0 relative flex justify-center rounded-full py-2 active:bg-zinc-800 max-md:flex-1 max-md:duration-200 md:hover:bg-zinc-800'>
                  <PageSelector route='/recent' />
                  <TbHistory className='h-6' />
                  <Vibrator />
                </Link>
              </Tooltip>
              <TbLineDashed className='h-8 stroke-zinc-800 max-md:hidden' />
              <Tooltip content='Горячие клавиши' side='right' sideOffset={6}>
                <Link href={'/shortcuts'} className='relative  flex justify-center rounded-full py-2 hover:bg-zinc-800 max-md:hidden'>
                  <TbKeyboard className='h-6' />
                  <PageSelector route='/shortcuts' />
                </Link>
              </Tooltip>
            </ul>
            <Tooltip
              content={
                <>
                  Поддержите проект на <span className='font-bold text-pink-500'>Github</span>
                </>
              }
              side='right'
              sideOffset={6}
            >
              <a href={project.links.github} target='_blank' className='flex justify-center rounded-full py-2 hover:bg-zinc-800 max-md:hidden'>
                <TbBrandGithub className='h-6' />
              </a>
            </Tooltip>
          </nav>
          <section className='overflow-y-auto overflow-x-hidden rounded-lg [grid-area:main] max-md:px-4 md:mb-3 md:mr-3 md:border-2 md:border-zinc-800 md:px-4 md:[scrollbar-gutter:stable]'>{children}</section>
        </div>
        <Store />
      </body>
    </html>
  )
}
