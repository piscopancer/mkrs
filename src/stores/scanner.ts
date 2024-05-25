import { proxy } from 'valtio'
import { z } from 'zod'

export const scannerStoreSchema = z.object({
  imageData: z.string().optional(),
  recognitions: z.array(z.string()),
})
const defaultScannerStore: z.infer<typeof scannerStoreSchema> = {
  imageData: undefined,
  recognitions: [],
}

export const scannerStore = proxy({ ...defaultScannerStore })
