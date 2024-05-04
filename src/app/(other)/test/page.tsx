'use client'

import MemoGame from '@/components/memo-game'

export default function TestPage() {
  return (
    <div className='fixed inset-0 bg-zinc-900 p-4'>
      <MemoGame props={{}} className='size-full' />
    </div>
  )
}
