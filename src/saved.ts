'use client'

import { devtools } from 'valtio/utils'
import { proxy } from 'valtio'

const defaultSavedStore = {
  saved: [] as string[],
}

export const savedStore = proxy({ ...defaultSavedStore })

devtools(savedStore)
