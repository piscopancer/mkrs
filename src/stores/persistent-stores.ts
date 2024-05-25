'use client'

import { differenceInDays } from 'date-fns'
import { useEffect } from 'react'
import { subscribe } from 'valtio'
import { ZodType, z } from 'zod'
import { assignObject } from '../utils'
import { generalStore, generalStoreSchema } from './general'
import { memoStore, memoStoreSchema } from './memo'
import { recentStore, recentStoreSchema } from './recent'
import { savedStore, savedStoreSchema } from './saved'
import { scannerStore, scannerStoreSchema } from './scanner'

type PersistentStore<StoreSchema extends ZodType, Store extends z.infer<StoreSchema> = z.infer<StoreSchema>> = {
  name: string
  store: Store
  schema: StoreSchema
  onSuccess?: (data: Store) => Store
}

function persistStore<StoreSchema extends ZodType>(store: PersistentStore<StoreSchema>): PersistentStore<StoreSchema> {
  return store
}

export const persistentStores = [
  persistStore({
    name: 'memo',
    store: memoStore,
    schema: memoStoreSchema,
  }),
  persistStore({
    name: 'recent',
    store: recentStore,
    schema: recentStoreSchema,
    onSuccess: (data) => ({
      recent: data.recent.filter((r) => differenceInDays(Date.now(), r.date) < 7),
    }),
  }),
  persistStore({
    name: 'saved',
    store: savedStore,
    schema: savedStoreSchema,
  }),
  persistStore({
    name: 'general',
    store: generalStore,
    schema: generalStoreSchema,
  }),
  persistStore({
    name: 'scanner',
    store: scannerStore,
    schema: scannerStoreSchema,
  }),
] as const satisfies ReturnType<typeof persistStore>[]

function tryLoadStore(ps: ReturnType<typeof persistStore>) {
  const storeString = localStorage.getItem(ps.name)
  if (!storeString) return
  const parseRes = ps.schema.safeParse(JSON.parse(storeString))
  if (parseRes.success) {
    const modifiedData = ps.onSuccess?.(parseRes.data) || parseRes.data
    assignObject(ps.store, modifiedData || parseRes.data)
  }
}

export function PersistentStores() {
  useEffect(() => {
    for (const ps of persistentStores) {
      tryLoadStore(ps)
      subscribe(ps.store, () => localStorage.setItem(ps.name, JSON.stringify(ps.store)))
    }
  }, [])
  return null
}
