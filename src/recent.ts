import { differenceInDays } from 'date-fns'
import { z } from 'zod'
import { recentSchema, recentStore } from './stores/recent'

type RecentSearch = z.infer<typeof recentSchema>

export function groupByDate(recents: RecentSearch[]): Record<string, { name: string; recent: RecentSearch[] }> {
  const today: RecentSearch[] = []
  const yesterday: RecentSearch[] = []
  const thisWeek: RecentSearch[] = []
  recents.forEach((r) => {
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
  const todayRecentIndex = recentStore.recent.get().findIndex((r) => r.search === recent && differenceInDays(Date.now(), r.date) < 1)
  if (todayRecentIndex !== -1) {
    recentStore.recent[todayRecentIndex].date.set(new Date())
  } else {
    recentStore.recent.set((draft) =>
      draft.push({
        search: recent,
        date: new Date(),
      }),
    )
  }
}
