'use client'

import { tryLoadGeneralStore } from '@/general-store'
import { tryLoadRecentStore } from '@/recent'
import { tryLoadSavedStore } from '@/saved'
import { useEffect } from 'react'

export default function Store() {
  useEffect(() => {
    tryLoadRecentStore()
    tryLoadSavedStore()
    tryLoadGeneralStore()
  }, [])
  return <div hidden id='valtio'></div>
}
