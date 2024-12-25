import { store } from '@davstack/store'
import { differenceInDays } from 'date-fns'
import { z } from 'zod'

export const recentSchema = z.object({
  search: z.string(),
  date: z.coerce.date(),
})
export const recentStoreSchema = z.object({
  recent: z.array(recentSchema),
})
const defaultRecentStore: z.infer<typeof recentStoreSchema> = {
  recent: [],
}

export const recentStore = store(defaultRecentStore, {
  persist: {
    onRehydrateStorage(persisted) {
      const parseRes = recentStoreSchema.safeParse(persisted)
      if (parseRes.error) {
        recentStore.set(defaultRecentStore)
        recentStore.recent.set((prev) => prev.filter((r) => differenceInDays(Date.now(), r.date) < 7))
      } else {
        recentStore.set(persisted)
      }
    },
  },
})
