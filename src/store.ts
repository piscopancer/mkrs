'use client'

import { devtools } from 'valtio/utils'
import { proxy, ref, useSnapshot } from 'valtio'

const defaultStore = {}

export const store = proxy(defaultStore)

export function useStoreSnapshot() {
  return useSnapshot(store)
}

devtools(store)
