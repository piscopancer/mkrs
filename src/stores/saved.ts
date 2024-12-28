import { store } from '@davstack/store'
import { z } from 'zod'
import { createPersistentStoreProps } from './utils'

const savedStoreSchema = z.object({
  saved: z.array(z.string()),
})

const defaultSavedStore: z.infer<typeof savedStoreSchema> = {
  saved: [],
}

export const savedStore = store(defaultSavedStore)

export const persistentSavedStoreProps = createPersistentStoreProps({
  name: 'saved',
  store: savedStore,
  schema: savedStoreSchema,
})
