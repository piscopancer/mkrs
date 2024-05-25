import { proxy } from 'valtio'
import { z } from 'zod'

export const generalStoreSchema = z.object({
  animeGirls: z.boolean(),
  showMemoryGame: z.boolean(),
})
const defaultGeneralStore: z.infer<typeof generalStoreSchema> = {
  animeGirls: false,
  showMemoryGame: false,
}

export const generalStore = proxy({ ...defaultGeneralStore })
