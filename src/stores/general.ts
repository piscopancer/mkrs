import { backgrounds } from '@/assets/bg'
import { copyModes } from '@/copying'
import { store } from '@davstack/store'
import { z } from 'zod'
import { createPersistentStoreProps } from './utils'

export const generalStoreSchema = z.object({
  animeGirls: z.boolean(),
  autoChangeBackground: z.boolean(),
  background: z.enum(backgrounds),
  copyMode: z.enum(copyModes),
})

const defaultGeneralStore: z.infer<typeof generalStoreSchema> = {
  animeGirls: false,
  autoChangeBackground: true,
  background: 'bamboo',
  copyMode: 'ch',
}

export const generalStore = store(defaultGeneralStore)

export const persistentGeneralStoreProps = createPersistentStoreProps({
  name: 'general',
  store: generalStore,
  schema: generalStoreSchema,
})
