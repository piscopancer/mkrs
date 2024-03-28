'use client'

import { proxy, subscribe } from 'valtio'
import { z } from 'zod'
import { assignObject } from './utils'

const storeName = 'saved'
const savedStoreSchema = z.object({
  saved: z.array(z.string()),
})
const defaultSavedStore: z.infer<typeof savedStoreSchema> = {
  saved: [],
}

export const savedStore = proxy({ ...defaultSavedStore })
export function tryLoadSavedStore() {
  const storeString = localStorage.getItem(storeName)
  if (!storeString) return
  const parseRes = savedStoreSchema.safeParse(JSON.parse(storeString))
  if (parseRes.success) {
    assignObject(savedStore, parseRes.data)
  }
}

subscribe(savedStore, () => localStorage.setItem(storeName, JSON.stringify(savedStore)))
