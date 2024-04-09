'use client'

import { tryLoadGeneralStore } from '@/general-store'
import { tryLoadHandwritingStore } from '@/handwriting'
import { tryLoadRecentStore } from '@/recent'
import { tryLoadSavedStore } from '@/saved'
import { tryLoadScannerStore } from '@/scanner'
import { useEffect } from 'react'

export default function Store() {
  useEffect(() => {
    tryLoadRecentStore()
    tryLoadSavedStore()
    tryLoadGeneralStore()
    tryLoadHandwritingStore()
    tryLoadScannerStore()
  }, [])
  return <div hidden id='valtio'></div>
}
