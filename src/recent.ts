'use client'

import { differenceInDays } from 'date-fns'
import { proxy, subscribe } from 'valtio'
import { z } from 'zod'
import { TSnapshot, assignObject } from './utils'

const storeName = 'recent'
const recentSchema = z.object({
  search: z.string(),
  date: z.coerce.date(),
})
type RecentSearch = z.infer<typeof recentSchema>
const recentStoreSchema = z.object({
  recent: z.array(recentSchema),
})
const defaultRecentStore: z.infer<typeof recentStoreSchema> = {
  recent: [],
}

export const recentStore = proxy({ ...defaultRecentStore })

export function tryLoadRecentStore() {
  const storeString = localStorage.getItem(storeName)
  if (!storeString) return
  const parseRes = recentStoreSchema.safeParse(JSON.parse(storeString))
  if (parseRes.success) {
    parseRes.data.recent = parseRes.data.recent.filter((r) => differenceInDays(Date.now(), r.date) < 7)
    assignObject(recentStore, parseRes.data)
  }
}

subscribe(recentStore, () => localStorage.setItem(storeName, JSON.stringify(recentStore)))

export function groupByDate(recent: TSnapshot<RecentSearch[]>): Record<string, { name: string; recent: RecentSearch[] }> {
  const today: RecentSearch[] = []
  const yesterday: RecentSearch[] = []
  const thisWeek: RecentSearch[] = []
  recent.forEach((r) => {
    const daysPassed = differenceInDays(new Date(), r.date)
    if (daysPassed < 1) {
      today.push(r)
    } else if (daysPassed === 1) {
      yesterday.push(r)
    } else if (daysPassed > 1 && daysPassed < 7) {
      thisWeek.push(r)
    }
  })
  return {
    today: { name: 'Сегодня', recent: today },
    yesterday: { name: 'Вчера', recent: yesterday },
    thisWeek: { name: 'На этой неделе', recent: thisWeek },
  }
}

export function addRecent(recent: string) {
  const todayRecent = recentStore.recent.find((r) => r.search === recent && differenceInDays(Date.now(), r.date) < 1)
  if (todayRecent) {
    todayRecent.date = new Date()
  } else {
    recentStore.recent.push({
      search: recent,
      date: new Date(),
    })
  }
}
