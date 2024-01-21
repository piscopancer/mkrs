'use client'

import { parseLsForSavedStore, savedStore } from '@/saved'
import { assignObject } from '@/utils'
import { useEffect } from 'react'

export default function Store() {
  useEffect(() => {
    const parsedSavedStore = parseLsForSavedStore()
    parsedSavedStore && assignObject(savedStore, parsedSavedStore)
  }, [])
  return <div hidden id='valtio'></div>
}
