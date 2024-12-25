import { store } from '@davstack/store'
import { z } from 'zod'

export const savedStoreSchema = z.object({
  saved: z.array(z.string()),
})
const defaultSavedStore: z.infer<typeof savedStoreSchema> = {
  saved: [],
}

export const savedStore = store(defaultSavedStore, {
  persist: {
    name: 'saved',
    onRehydrateStorage(persisted) {
      const parseRes = savedStoreSchema.safeParse(persisted)
      if (parseRes.error) {
        savedStore.set(defaultSavedStore)
      } else {
        savedStore.set(persisted)
      }
    },
  },
})
