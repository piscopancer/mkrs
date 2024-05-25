'use client'

import { proxy } from 'valtio'
import { z } from 'zod'

export const scannerStoreSchema = z.object({
  imageData: z.string().optional(),
  recognitions: z.array(z.string()),
})
const defaultScannerStore: z.infer<typeof scannerStoreSchema> = {
  imageData: undefined,
  recognitions: [],
}

export const scannerStore = proxy({ ...defaultScannerStore })
// export function tryLoadScannerStore() {
//   const storeString = localStorage.getItem(storeName)
//   if (!storeString) return
//   const parseRes = scannerStoreSchema.safeParse(JSON.parse(storeString))
//   if (parseRes.success) {
//     assignObject(scannerStore, parseRes.data)
//   }
// }

// subscribe(scannerStore, () => localStorage.setItem(storeName, JSON.stringify(scannerStore)))
