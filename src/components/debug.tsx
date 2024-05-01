'use client'

import { objectEntries } from '@/utils'
import clsx from 'clsx'
import { proxy, useSnapshot } from 'valtio'

export const debugStore = proxy({
  querying: false,
})

export default function Debug() {
  const debugSnap = useSnapshot(debugStore)

  return (
    <ul className='fixed bottom-0 right-0 list-none bg-black/20 p-2 text-sm text-zinc-200'>
      {objectEntries(debugSnap).map(([k, v]) => (
        <li key={k}>
          <span className='text-zinc-400'>{k}:</span> <span className={clsx(typeof v === 'boolean' && (v ? 'text-lime-400' : 'text-red-500'))}>{String(v)}</span>
        </li>
      ))}
    </ul>
  )
}
