'use client'

import { proxy, subscribe } from 'valtio'
import { devtools } from 'valtio/utils'

const defaultSavedStore = {
  saved: [] as string[],
}

export const savedStore = proxy({ ...defaultSavedStore })

export function parseLsForSavedStore() {
  const storeString = localStorage.getItem('store')
  if (!storeString) return
  return JSON.parse(storeString) as typeof defaultSavedStore
}

subscribe(savedStore, () => localStorage.setItem('store', JSON.stringify(savedStore)))

devtools(savedStore)
