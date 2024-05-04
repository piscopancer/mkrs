import { IconType } from 'react-icons'
import { GiBearHead, GiDirewolf, GiSpikedDragonHead } from 'react-icons/gi'
import { proxy, subscribe } from 'valtio'
import { z } from 'zod'
import { assignObject, theme } from './utils'

const difficulties = ['easy', 'medium', 'hard'] as const
const states = ['active', 'paused', 'cancelled', 'completed'] as const

const memoGameSchema = z.object({
  id: z.string().uuid(),
  difficulty: z.enum(difficulties),
  time: z.number().min(0),
  state: z.enum(states),
  words: z.array(z.string()),
  seed: z.number(),
  solvedWords: z.array(z.string()),
})

export type MemoGame = z.infer<typeof memoGameSchema>

export const difficultiesInfo = {
  easy: {
    words: 8,
    name: 'Нормально',
    icon: GiDirewolf,
    color: theme.colors.slate[400],
  },
  medium: {
    words: 12,
    name: 'Сложно',
    icon: GiBearHead,
    color: theme.colors.orange[600],
  },
  hard: {
    words: 18,
    name: 'Невыносимо',
    icon: GiSpikedDragonHead,
    color: theme.colors.red[500],
  },
} as const satisfies Record<(typeof difficulties)[number], { name: string; icon: IconType; color: string; words: number }>

const storeName = 'memo'
const memoStoreSchema = z.object({
  currentGame: memoGameSchema.optional(),
  gamesPlayed: z.array(memoGameSchema),
  gameSettings: memoGameSchema.pick({ words: true, seed: true, difficulty: true }),
})
const defaultMemoStore: z.infer<typeof memoStoreSchema> = {
  currentGame: undefined,
  gameSettings: {
    difficulty: 'easy',
    seed: 0,
    words: ['小', '大'],
  },
  gamesPlayed: [],
}
export const memoStore = proxy({ ...defaultMemoStore })
export function tryLoadMemoStore() {
  const storeString = localStorage.getItem(storeName)
  if (!storeString) return
  const parseRes = memoStoreSchema.safeParse(JSON.parse(storeString))
  if (parseRes.success) {
    assignObject(memoStore, parseRes.data)
  }
}
subscribe(memoStore, () => localStorage.setItem(storeName, JSON.stringify(memoStore)))
