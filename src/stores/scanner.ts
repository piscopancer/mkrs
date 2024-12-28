import { store } from '@davstack/store'
import { z } from 'zod'
import { createPersistentStoreProps } from './utils'

export const scannerStoreSchema = z.object({
  imageData: z.string().optional(),
  recognitions: z.array(z.string()),
})
const defaultScannerStore: z.infer<typeof scannerStoreSchema> = {
  imageData: undefined,
  recognitions: [],
}

export const scannerStore = store(defaultScannerStore)

export const persistentScannerStoreProps = createPersistentStoreProps({
  name: 'scanner',
  store: scannerStore,
  schema: scannerStoreSchema,
})
