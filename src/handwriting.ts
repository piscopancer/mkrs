'use client'

import { proxy, subscribe } from 'valtio'
import { z } from 'zod'
import { assignObject } from './utils'

export const strokeSizesInfo = {
  15: { scale: 1 },
  20: { scale: 1.3 },
  25: { scale: 1.8 },
} as const satisfies Record<z.infer<typeof handwritingStoreSchema>['strokeSize'], { scale: number }>

export const canvasSizesInfo = {
  sm: { rem: 16 },
  base: { rem: 18 },
  lg: { rem: 24 },
} as const satisfies Record<z.infer<typeof handwritingStoreSchema>['canvasSize'], { rem: number }>

const storeName = 'handwriting'
const handwritingStoreSchema = z.object({
  strokeSize: z.union([z.literal(15), z.literal(20), z.literal(25)]),
  canvasSize: z.union([z.literal('sm'), z.literal('base'), z.literal('lg')]),
})

const defaultHandwritingStore: z.infer<typeof handwritingStoreSchema> = {
  strokeSize: 15,
  canvasSize: 'base',
}

export const handwritingStore = proxy({ ...defaultHandwritingStore })
export function tryLoadHandwritingStore() {
  const storeString = localStorage.getItem(storeName)
  if (!storeString) return
  const parseRes = handwritingStoreSchema.safeParse(JSON.parse(storeString))
  if (parseRes.success) {
    assignObject(handwritingStore, parseRes.data)
  }
}

subscribe(handwritingStore, () => localStorage.setItem(storeName, JSON.stringify(handwritingStore)))
