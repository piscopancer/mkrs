'use client'

import { fontsVars } from '@/assets/fonts'
import '@/assets/styles/style.scss'
import { Tooltip } from '@/components/tooltip'
import useHotkey from '@/hooks/use-hotkey'
import { hotkeys } from '@/hotkeys'
import { project } from '@/project'
import { qc } from '@/query'
import { searchStore } from '@/search'
import { generalStore } from '@/stores/general'
import PersistentStores from '@/stores/persistent-stores'
import { route } from '@/utils'
import { QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { IconContext } from 'react-icons'
import { TbBrandGithub, TbDeviceFloppy, TbHistory, TbKeyboard } from 'react-icons/tb'
import Vibrator from '../components/vibrator'
import Logo from './()/logo'
import PageSelector from './()/page-selector'
import Settings from './()/settings'
import { layoutStore } from './()/store'
import SelectedWordMenu from './(main)/search/[slug]/()/selected-words-menu'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const animeGirlsSnap = generalStore.animeGirls.use()
  const router = useRouter()
  useHotkey(hotkeys['main-page'].keys, () => !searchStore.focused.get() && router.push('/'))
  useHotkey(hotkeys['recent-page'].keys, () => !searchStore.focused.get() && router.push('/recent'))
  useHotkey(hotkeys['saved-page'].keys, () => !searchStore.focused.get() && router.push('/saved'))
  const containerRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    layoutStore.mainContainer.set(containerRef)
  }, [containerRef.current])

  return (
    <html lang='ru'>
      <body className={clsx(fontsVars, 'bg-zinc-900 font-sans text-base text-zinc-200 [color-scheme:dark]')}>
        <QueryClientProvider client={qc}>
          <IconContext.Provider value={{ style: { strokeWidth: 1.5 } }}>
            <div
              className={clsx(
                'grid h-svh grid-cols-[min-content,1fr] grid-rows-[min-content,1fr] [grid-template-areas:"logo_header"_"nav_main"] max-md:grid-rows-[min-content,1fr,min-content] max-md:[grid-template-areas:"logo_header"_"main_main"_"nav_nav"]',
                !animeGirlsSnap && 'max-md:[grid-template-areas:"header_header"_"main_main"_"nav_nav"]',
              )}
            >
              {animeGirlsSnap && (
                <div className={'flex size-20 items-center justify-center [grid-area:logo]'}>
                  <Logo />
                </div>
              )}
              <header className={clsx('ml-4 mr-4 flex h-20 items-center self-center [grid-area:header] max-md:ml-0', !animeGirlsSnap && 'max-md:ml-4')}>
                <Link href={'/'} className='mr-auto font-display font-bold'>
                  <span className='mr-4'>МКРС </span>
                  <span className='text-xs text-zinc-600 max-md:hidden'>{'//'} БКРС-ИК</span>
                </Link>
                {/* <Game /> */}
                <Settings />
              </header>
              <nav className='flex w-20 justify-between overflow-x-hidden py-6 [grid-area:nav] max-md:w-auto max-md:py-2 md:flex-col md:px-3'>
                <Tooltip content='Главная' side='right' sideOffset={6}>
                  <Link href={'/'} className='relative flex justify-center rounded-full py-2 active:bg-zinc-800 max-md:order-1 max-md:flex-1 max-md:text-lg max-md:duration-200 md:hover:bg-zinc-800'>
                    <PageSelector route={route('/')} />小
                    <Vibrator />
                  </Link>
                </Tooltip>
                <ul className='flex flex-col gap-2 max-md:contents'>
                  <Tooltip content='Сохраненные' side='right' sideOffset={6}>
                    <Link href={'/saved'} className='relative flex justify-center rounded-full py-2 active:bg-zinc-800 max-md:order-2 max-md:flex-1 max-md:duration-200 md:hover:bg-zinc-800'>
                      <PageSelector route={route('/saved')} />
                      <TbDeviceFloppy className='h-6' />
                      <Vibrator />
                    </Link>
                  </Tooltip>
                  <Tooltip content='Недавние' side='right' sideOffset={6}>
                    <Link href={'/recent'} className='max-md:order-0 relative flex justify-center rounded-full py-2 active:bg-zinc-800 max-md:flex-1 max-md:duration-200 md:hover:bg-zinc-800'>
                      <PageSelector route={route('/recent')} />
                      <TbHistory className='h-6' />
                      <Vibrator />
                    </Link>
                  </Tooltip>
                  <div className='mx-auto my-2 w-6 border-b-2 border-zinc-800 max-md:hidden' />
                  <Tooltip content='Горячие клавиши' side='right' sideOffset={6}>
                    <Link href={'/hotkeys'} className='relative  flex justify-center rounded-full py-2 hover:bg-zinc-800 max-md:hidden'>
                      <TbKeyboard className='h-6' />
                      <PageSelector route={route('/hotkeys')} />
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
              <section
                ref={containerRef}
                className='relative overflow-y-auto overflow-x-hidden rounded-lg [grid-area:main] [scrollbar-gutter:stable] max-md:px-4 max-md:[scrollbar-color:theme(colors.zinc.800)_transparent] max-md:[scrollbar-width:thin] md:mb-3 md:mr-3 md:border-2 md:border-zinc-800 md:px-4'
              >
                {children}
              </section>
            </div>
          </IconContext.Provider>
        </QueryClientProvider>
        {/*  */}
        <SelectedWordMenu />
        <Analytics />
        <PersistentStores />
        {/* {process.env.NODE_ENV !== 'production' && <Debug />} */}
      </body>
    </html>
  )
}
