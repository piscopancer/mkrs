'use client'

import { differenceInDays } from 'date-fns'
import { proxy, subscribe } from 'valtio'
import { devtools } from 'valtio/utils'
import { TSnapshot, assignObject, parseLsForStore } from './utils'

type TRecent = {
  search: string
  date: Date
}

const defaultRecentStore = {
  recent: [] as TRecent[],
}

export const recentStore = proxy({ ...defaultRecentStore })

const storeName = 'recent'

export function tryInitRecentStore() {
  const parsedStore = parseLsForStore<typeof recentStore>(storeName)
  if (parsedStore) {
    parsedStore.recent = parsedStore.recent.filter((r) => differenceInDays(Date.now(), r.date) < 7)
    assignObject(recentStore, parsedStore)
  }
}

subscribe(recentStore, () => localStorage.setItem(storeName, JSON.stringify(recentStore)))

devtools(recentStore)

export function groupByDate(recent: TSnapshot<TRecent[]>): Record<string, { name: string; recent: TRecent[] }> {
  const today: TRecent[] = []
  const yesterday: TRecent[] = []
  const thisWeek: TRecent[] = []

  recent.forEach((r) => {
    const daysPassed = differenceInDays(Date.now(), r.date)
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
