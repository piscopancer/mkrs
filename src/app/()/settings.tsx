'use client'

import Switch from '@/components/switch'
import { generalStore } from '@/stores/general'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import type { Route } from 'next'
import Link from 'next/link'
import { TbInfoSquareRounded, TbSettings } from 'react-icons/tb'
import { useSnapshot } from 'valtio'

export default function Settings() {
  const generalSnap = useSnapshot(generalStore)

  return (
    <Dropdown.Root>
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
              <span className='mb-1'>Аниме девочки</span>
              <span className='row-start-2 text-xs text-zinc-500'>Включение может снизить скорость поиска: браузер сначала грузит гифки, только потом слово. Ваш интернет должен быть быстрым!</span>
              <Switch
                className='row-span-2'
                props={{
                  enabled: generalSnap.animeGirls,
                  action: (prev) => {
                    generalStore.animeGirls = !prev
                    return !prev
                  },
                }}
              />
            </li>
          </ul>
          <Dropdown.Arrow className='fill-zinc-800' />
        </>
      </Dropdown.Content>
      <Dropdown.Trigger className={clsx('flex items-center justify-center rounded-full px-4 py-2 text-zinc-200 max-md:active:bg-zinc-800 md:hover:bg-zinc-800')}>
        <TbSettings className='size-6' />
      </Dropdown.Trigger>
    </Dropdown.Root>
  )
}
