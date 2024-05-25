import { proxy } from 'valtio'
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

export const recentStore = proxy({ ...defaultRecentStore })
