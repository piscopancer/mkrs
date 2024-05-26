import { backgrounds } from '@/assets/bg'
import { proxy } from 'valtio'
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

export const generalStore = proxy({ ...defaultGeneralStore })
