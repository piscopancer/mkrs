'use client'

import { searchStore } from '@/search'
import type { TComponent } from '@/utils'
import { clsx } from 'clsx'
import { useState } from 'react'
import { TbArrowBackUp, TbEraser } from 'react-icons/tb'

export default function Handwriting({ props, ...attr }: TComponent<'section', {}>) {
  const [suggestions] = useState(['草', '并', '路', '超'])

  return (
    <article {...attr} className={clsx(attr.className, 'flex')}>
      <div className='w-72 rounded-l-3xl rounded-br-3xl border-2 border-zinc-800 bg-zinc-900'>
        <div className='group hopper'>
          <canvas className='aspect-square w-full cursor-crosshair'></canvas>
          <div className='pointer-events-none h-4/5 w-0.5 place-self-center bg-gradient-to-b from-transparent via-zinc-800 to-transparent opacity-50 duration-300 group-hover:opacity-100' />
          <div className='pointer-events-none h-0.5 w-4/5 place-self-center bg-gradient-to-r from-transparent via-zinc-800 to-transparent opacity-50 duration-300 group-hover:opacity-100' />
        </div>
        <menu className='mb-2 flex justify-center'>
          <li>
            <button className='px-3 text-zinc-500 duration-100 hover:text-zinc-300'>
              <TbArrowBackUp className='size-6' />
            </button>
          </li>
          <li>
            <button className='px-3 text-zinc-500 duration-100 hover:text-zinc-300'>
              <TbEraser className='size-6' />
            </button>
          </li>
        </menu>
      </div>
      <div className='h-fit grow rounded-r-3xl border-y-2 border-r-2 border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-800 px-4 py-3'>
        <header className='mb-4 flex items-center'>
          <h1 className='mr-auto font-mono text-sm text-zinc-500'>Рукописный ввод</h1>
          <aside className='font-mono text-xs'>
            <span className='mr-2 rounded-md px-2 text-zinc-400 shadow-[0_1px_0_2px_theme(colors.zinc.700)]'>0-9</span>
            <span className='text-zinc-500'>Выбор</span>
          </aside>
        </header>
        <menu className='flex min-h-24 flex-wrap gap-2'>
          {suggestions.map((s) => (
            <li key={s}>
              <button
                onClick={() => {
                  searchStore.inputValue = searchStore.inputValue + s
                }}
                className='border-b-2 border-zinc-700 pb-1 text-3xl text-zinc-300 hover:border-zinc-500 hover:text-zinc-200'
              >
                {s}
              </button>
            </li>
          ))}
        </menu>
      </div>
    </article>
  )
}
