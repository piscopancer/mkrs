'use client'

import { backgrounds } from '@/assets/bg'
import Switch from '@/components/switch'
import { CopyMode, copyMode } from '@/copying'
import { generalStore } from '@/stores/general'
import { objectEntries } from '@/utils'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import type { Route } from 'next'
import Link from 'next/link'
import { ComponentProps, ReactNode } from 'react'
import { TbInfoSquareRounded, TbSettings } from 'react-icons/tb'

export default function Settings() {
  const generalSnap = generalStore.use()

  return (
    <Dropdown.Root>
      <Dropdown.Trigger className={clsx('flex items-center justify-center rounded-full px-4 py-2 text-zinc-200 max-md:active:bg-zinc-800 md:hover:bg-zinc-800')}>
        <TbSettings className='size-6' />
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content sideOffset={8} className='z-[1] px-3 max-md:w-screen max-md:px-3 md:w-[40ch]'>
          <>
            <ul className='flex flex-col rounded-xl border-2 border-zinc-800 bg-zinc-900'>
              <li className='mb-4'>
                <Dropdown.Item asChild>
                  <Link href={'/info' as Route} className='flex items-center rounded-t-[10px] bg-gradient-to-r from-zinc-800/50 to-transparent p-4 outline-none duration-200 focus:from-zinc-800'>
                    <TbInfoSquareRounded className='h-5 w-5 stroke-zinc-400' />
                    <span className='ml-auto'>О МКРС</span>
                  </Link>
                </Dropdown.Item>
              </li>
              <li className='mb-4 grid grid-cols-[auto,min-content] gap-x-2 px-4'>
                <span className='mb-1 block'>Аниме девочки</span>
                <span className='row-start-2 text-xs text-zinc-500'>Включение может снизить скорость поиска: браузер сначала грузит гифки, только потом слово. Ваш интернет должен быть быстрым!</span>
                <Switch
                  className='row-span-2'
                  props={{
                    enabled: generalSnap.animeGirls,
                    action: (prev) => {
                      generalStore.animeGirls.set(!prev)
                      return !prev
                    },
                  }}
                />
              </li>
              <li className='mb-4 px-4'>
                <div className='mb-2 flex items-center gap-x-2'>
                  <span className='block grow'>Менять обои ежедневно</span>
                  <Switch
                    props={{
                      enabled: generalSnap.autoChangeBackground,
                      action: (prev) => {
                        generalStore.autoChangeBackground.set(!prev)
                        return !prev
                      },
                    }}
                  />
                </div>
                <div className='flex items-center gap-x-2'>
                  <span className='mr-auto block'>Текущие обои</span>
                  <div className={clsx('flex items-center duration-100', generalSnap.autoChangeBackground && 'opacity-50')}>
                    <button
                      disabled={generalSnap.autoChangeBackground}
                      onClick={() => {
                        const nextIndex = backgrounds.indexOf(generalStore.background.get()) - 1
                        generalStore.background.set(backgrounds[nextIndex === -1 ? backgrounds.length - 1 : nextIndex])
                      }}
                      className='rounded-l-md bg-zinc-800 px-2 py-1 font-mono duration-100 enabled:hover:bg-zinc-700'
                    >
                      {'<-'}
                    </button>
                    <span className='bg-zinc-800/50 px-3 py-1 font-mono'>
                      {backgrounds.indexOf(generalSnap.background) + 1}
                      <span className='text-zinc-400'>/{backgrounds.length}</span>
                    </span>
                    <button
                      disabled={generalSnap.autoChangeBackground}
                      onClick={() => {
                        const nextIndex = backgrounds.indexOf(generalStore.background.get()) + 1
                        generalStore.background.set(backgrounds[nextIndex === backgrounds.length ? 0 : nextIndex])
                      }}
                      className='rounded-r-md bg-zinc-800 px-2 py-1 font-mono duration-100 enabled:hover:bg-zinc-700'
                    >
                      {'->'}
                    </button>
                  </div>
                </div>
              </li>
              <li className='mb-2 px-4'>
                <h2 className='mb-2 block grow'>Копирование</h2>
                <menu className='flex'>
                  {objectEntries(copyMode).map(([mode, info]) => {
                    const CopyModeExample = copyModeExamples[mode]
                    const selected = generalSnap.copyMode === mode
                    return (
                      <button
                        key={mode}
                        onClick={() => {
                          generalStore.copyMode.set(mode)
                        }}
                        className={clsx('group flex-1', selected ? '' : '')}
                      >
                        <CopyModeExample className={clsx('py-2 text-sm group-first:rounded-l-lg group-last:rounded-r-lg', selected ? 'bg-zinc-800' : 'bg-zinc-800/50')} />
                        <span className='text-center text-xs text-zinc-500'>{info.text}</span>
                      </button>
                    )
                  })}
                </menu>
              </li>
            </ul>
            <Dropdown.Arrow className='fill-zinc-800' />
          </>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  )
}

const copyModeExamples: Record<CopyMode['type'], (props: ComponentProps<'div'>) => ReactNode> = {
  ch: (props) => <div {...props}>炸弹</div>,
  full: (props) => (
    <div {...props}>
      炸弹 <span className='font-mono text-zinc-400'>`zhàdàn`</span> бомба
    </div>
  ),
}
