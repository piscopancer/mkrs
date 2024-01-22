'use client'

import { proxy, subscribe } from 'valtio'
import { devtools } from 'valtio/utils'
import { assignObject, parseLsForStore } from './utils'

const defaultSavedStore = {
  saved: [] as string[],
}

export const savedStore = proxy({ ...defaultSavedStore })

const storeName = 'saved'

export function tryInitSavedStore() {
  const parsedStore = parseLsForStore<typeof savedStore>(storeName)
  parsedStore && assignObject(savedStore, parsedStore)
}

subscribe(savedStore, () => localStorage.setItem(storeName, JSON.stringify(savedStore)))

devtools(savedStore)
