'use client'

import { proxy, subscribe } from 'valtio'
import { z } from 'zod'
import { assignObject } from './utils'

const storeName = 'scanner'
const scannerStoreSchema = z.object({
  imageData: z.string().optional(),
  recognitions: z.array(z.string()),
})
const defaultScannerStore: z.infer<typeof scannerStoreSchema> = {
  imageData: undefined,
  recognitions: [],
}

export const scannerStore = proxy({ ...defaultScannerStore })
export function tryLoadScannerStore() {
  const storeString = localStorage.getItem(storeName)
  if (!storeString) return
  const parseRes = scannerStoreSchema.safeParse(JSON.parse(storeString))
  if (parseRes.success) {
    assignObject(scannerStore, parseRes.data)
  }
}

subscribe(scannerStore, () => localStorage.setItem(storeName, JSON.stringify(scannerStore)))
