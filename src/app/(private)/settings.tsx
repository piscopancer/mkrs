'use client'

import Switch from '@/components/switch'
import { classes } from '@/utils'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
import { TbInfoSquareRounded, TbSettings } from 'react-icons/tb'
import { switchAnimeGirls } from '../actions'

export default function Settings(props: { showAnimeGirls: boolean }) {
  return (
    <Dropdown.Root>
      <Dropdown.Content sideOffset={8} className='z-[1] px-3 max-md:w-screen max-md:px-3 md:w-[40ch]'>
        <>
          <ul className='flex flex-col rounded-xl border-2 border-zinc-800 bg-zinc-900'>
            <li className='mb-4'>
              <Dropdown.Item asChild>
                <Link href={'/info'} className='flex items-center rounded-t-[10px] bg-gradient-to-r from-zinc-800/50 to-transparent p-4 outline-none duration-200 focus:from-zinc-800'>
                  <TbInfoSquareRounded className='h-5 w-5 stroke-zinc-400' />
                  <span className='ml-auto'>О МКРС</span>
                </Link>
              </Dropdown.Item>
            </li>
            <li className='mb-4 grid grid-cols-[auto,min-content] gap-x-2 px-4'>
              <span>Аниме девочки</span>
              <span className='row-start-2 text-xs text-zinc-500'>Включение может снизить скорость поиска: браузер сначала грузит гифки, только потом слово. Ваш интернет должен быть быстрым!</span>
              <Switch
                props={{
                  enabled: props.showAnimeGirls,
                  switch: async () => {
                    const after = await switchAnimeGirls()
                    return !!after
                  },
                }}
              />
            </li>
          </ul>
          <Dropdown.Arrow className='fill-zinc-800' />
        </>
      </Dropdown.Content>
      {/* <Tooltip content='Настройки' sideOffset={6}> */}
      <Dropdown.Trigger className={classes('flex items-center justify-center rounded-full p-3 px-4 py-2 text-zinc-200 max-md:active:bg-zinc-800 md:hover:bg-zinc-800')}>
        <TbSettings className='h-6' />
      </Dropdown.Trigger>
      {/* </Tooltip> */}
    </Dropdown.Root>
  )
}
