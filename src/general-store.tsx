'use client'

import { proxy, subscribe } from 'valtio'
import { z } from 'zod'
import { assignObject } from './utils'

const storeName = 'general'
const generalStoreSchema = z.object({
  animeGirls: z.boolean(),
  showMemoryGame: z.boolean(),
})
const defaultGeneralStore: z.infer<typeof generalStoreSchema> = {
  animeGirls: false,
  showMemoryGame: false,
}

export const generalStore = proxy({ ...defaultGeneralStore })
export function tryLoadGeneralStore() {
  const storeString = localStorage.getItem(storeName)
  if (!storeString) return
  const parseRes = generalStoreSchema.safeParse(JSON.parse(storeString))
  if (parseRes.success) {
    assignObject(generalStore, parseRes.data)
  }
}

subscribe(generalStore, () => localStorage.setItem(storeName, JSON.stringify(generalStore)))
