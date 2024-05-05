'use client'

import MemoGame from '@/components/memo-game'
import { memoStore } from '@/memo-game'
import { useEffect, useState } from 'react'
import { TbLoader } from 'react-icons/tb'
import { useSnapshot } from 'valtio'

export default function TestPage() {
  const [clientReady, setClientReady] = useState(false)
  const memoSnap = useSnapshot(memoStore)

  useEffect(() => {
    setClientReady(!!memoSnap)
  }, [memoSnap])

  if (!clientReady) {
    return (
      <div className='fixed inset-0 bg-black'>
        <TbLoader className='size-5 animate-spin' />
      </div>
    )
  }

  return (
    <div className='fixed inset-0 bg-zinc-900 p-4'>
      <MemoGame props={{ memoStore }} className='size-full' />
    </div>
  )
}
