'use client'

import { tryInitRecentStore } from '@/recent'
import { tryInitSavedStore } from '@/saved'
import { useEffect } from 'react'

export default function Store() {
  useEffect(() => {
    tryInitRecentStore()
    tryInitSavedStore()
  }, [])
  return <div hidden id='valtio'></div>
}
