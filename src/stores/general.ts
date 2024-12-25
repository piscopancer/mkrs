import { backgrounds } from '@/assets/bg'
import { store } from '@davstack/store'
import { z } from 'zod'

export const generalStoreSchema = z.object({
  animeGirls: z.boolean(),
  autoChangeBackground: z.boolean(),
  background: z.enum(backgrounds),
})
const defaultGeneralStore: z.infer<typeof generalStoreSchema> = {
  animeGirls: false,
  autoChangeBackground: true,
  background: 'bamboo',
}

export const generalStore = store(defaultGeneralStore, {
  persist: {
    onRehydrateStorage(persisted) {
      const parseRes = generalStoreSchema.safeParse(persisted)
      if (parseRes.error) {
        generalStore.set(defaultGeneralStore)
      } else {
        generalStore.set(persisted)
      }
    },
  },
})
