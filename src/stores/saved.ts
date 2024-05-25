import { proxy } from 'valtio'
import { z } from 'zod'

export const savedStoreSchema = z.object({
  saved: z.array(z.string()),
})
const defaultSavedStore: z.infer<typeof savedStoreSchema> = {
  saved: [],
}

export const savedStore = proxy({ ...defaultSavedStore })
