'use client'

import Reverso from '@/components/reverso'
import { autoUpdate, flip, offset, size, useFloating } from '@floating-ui/react'

export default function TestPage() {
  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [
      flip(),
      offset({ mainAxis: 16 }),
      size({
        padding: 16,
        apply({ availableHeight }) {
          if (refs.floating.current) {
            refs.floating.current.style.height = availableHeight + 'px'
          }
        },
      }),
    ],
  })

  return (
    <div className='mx-auto mt-24 h-[300vh] max-w-screen-md'>
      <Reverso mode='ch-en' search='看得' className='mb-[100vh]' />
      <div ref={refs.setReference} className='bg-rose-500 p-12' style={{}}>
        sex
      </div>
      <div ref={refs.setFloating} className='w-48 overflow-scroll rounded-lg bg-blue-400' style={floatingStyles}>
        <ul>
          {Array.from({ length: 30 }).map((_, i) => (
            <li key={i} className='my-2 rounded-md bg-blue-300 p-2'>
              🚁
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
