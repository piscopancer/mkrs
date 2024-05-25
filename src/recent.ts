import { differenceInDays } from 'date-fns'
import { z } from 'zod'
import { recentSchema, recentStore } from './stores/recent'
import { Snapshot } from './utils'

type RecentSearch = z.infer<typeof recentSchema>

export function groupByDate(recent: Snapshot<RecentSearch[]>): Record<string, { name: string; recent: RecentSearch[] }> {
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
