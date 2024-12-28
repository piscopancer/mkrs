import { backgrounds } from '@/assets/bg'
import { store } from '@davstack/store'
import { z } from 'zod'
import { createPersistentStoreProps } from './utils'

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

export const generalStore = store(defaultGeneralStore)

export const persistentGeneralStoreProps = createPersistentStoreProps({
  name: 'general',
  store: generalStore,
  schema: generalStoreSchema,
})
