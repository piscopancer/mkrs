import { store } from '@davstack/store'
import { z } from 'zod'

export const scannerStoreSchema = z.object({
  imageData: z.string().optional(),
  recognitions: z.array(z.string()),
})
const defaultScannerStore: z.infer<typeof scannerStoreSchema> = {
  imageData: undefined,
  recognitions: [],
}

export const scannerStore = store(defaultScannerStore, {
  persist: {
    onRehydrateStorage(persisted) {
      const parseRes = scannerStoreSchema.safeParse(persisted)
      if (parseRes.error) {
        scannerStore.set(defaultScannerStore)
      } else {
        scannerStore.set(persisted)
      }
    },
  },
})
