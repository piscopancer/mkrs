'use client'

import { objectEntries } from '@/utils'
import clsx from 'clsx'
import { transform } from 'framer-motion'
import colors from 'tailwindcss/colors'
import { proxy, useSnapshot } from 'valtio'

export const debugStore = proxy({
  // querying: false,
  // exp_expanded: false,
  // exp_animating: false,
  // exp_progress: 0,
  memo_rerenders: 0,
  memo_time: 0,
})

export default function Debug() {
  const debugSnap = useSnapshot(debugStore)

  if (true)
    return (
      <ul className='pointer-events-none fixed bottom-0 right-0 list-none bg-black/20 p-2 text-sm text-zinc-200'>
        {objectEntries(debugSnap).map(([k, v]) => (
          <li key={k}>
            <span className='text-zinc-400'>{k}:</span>{' '}
            <span style={typeof v === 'number' && v <= 1 ? { color: transform(v, [0, 1], [colors.red[500], colors.lime[400]]) } : {}} className={clsx(typeof v === 'boolean' && (v ? 'text-lime-400' : 'text-red-500'))}>
              {String(v)}
            </span>
          </li>
        ))}
      </ul>
    )
}
