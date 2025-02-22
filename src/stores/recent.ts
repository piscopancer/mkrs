import { store } from '@davstack/store'
import { differenceInDays } from 'date-fns'
import { z } from 'zod'
import { createPersistentStoreProps } from './utils'

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

export const recentStore = store(defaultRecentStore)

export const persistentRecentStoreProps = createPersistentStoreProps({
  name: 'recent',
  store: recentStore,
  schema: recentStoreSchema,
  after(parseRes) {
    if (parseRes.data) {
      const tooOldStripped = parseRes.data.recent.filter((r) => {
        return differenceInDays(Date.now(), r.date) < 7
      })
      recentStore.recent.set(tooOldStripped)
    }
  },
})
