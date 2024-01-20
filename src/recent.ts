'use client'

import { devtools } from 'valtio/utils'
import { proxy } from 'valtio'

const defaultRecentStore = {
  recent: [] as string[],
}

export const recentStore = proxy({ ...defaultRecentStore })

devtools(recentStore)
