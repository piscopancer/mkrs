'use client'

import { useRef } from 'react'
import { TbChevronDown } from 'react-icons/tb'

export default function TestPage() {
  const infoRef = useRef<HTMLParagraphElement>(null!)

  return (
    <div className='my-[100vh] grid w-full grid-cols-[1fr,minmax(max-content,theme(screens.md)),1fr]'>
      <div className='hopper overflow-hidden rounded-r-md bg-gradient-to-r from-transparent to-zinc-800'>
        <div className='mr-12 flex size-px items-center self-center justify-self-end overflow-visible'>
          <button className='text-6xl text-zinc-900 duration-100 hover:text-zinc-200'>#</button>
        </div>
      </div>
      <div className='relative bg-zinc-800 '>
        <h2 className='bg-halftone col-start-2 bg-zinc-900 px-4 py-2 font-display'>
          <div className='absolute inset-0 bg-gradient-to-b from-zinc-900 via-transparent to-zinc-900' />
          <button className='relative flex items-center'>
            <TbChevronDown className='mr-3 size-5' />
            <span className=''>Заголовок</span>
          </button>
        </h2>
      </div>
      <div className='hopper rounded-l-md bg-gradient-to-l from-transparent to-zinc-800'></div>
    </div>
  )
}
