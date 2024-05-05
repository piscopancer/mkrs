import { IconType } from 'react-icons'
import { GiBearHead, GiDirewolf, GiSpikedDragonHead } from 'react-icons/gi'
import { TbCheck, TbPlayerPause, TbPlayerPlay, TbX } from 'react-icons/tb'
import { proxy, subscribe } from 'valtio'
import { z } from 'zod'
import { assignObject } from './utils'

const difficulties = ['easy', 'medium', 'hard'] as const
const states = ['active', 'paused', 'cancelled', 'completed'] as const

export const statesInfo = {
  active: { name: 'Активно', icon: TbPlayerPlay },
  paused: { name: 'Приостановлено', icon: TbPlayerPause },
  cancelled: { name: 'Отменено', icon: TbX },
  completed: { name: 'Завершено', icon: TbCheck },
} satisfies Record<(typeof states)[number], { name: string; icon: IconType }>

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
export type MemoStore = typeof memoStore

export const difficultiesInfo = {
  easy: {
    words: 8,
    name: 'Нормально',
    icon: GiDirewolf,
  },
  medium: {
    words: 12,
    name: 'Сложно',
    icon: GiBearHead,
  },
  hard: {
    words: 18,
    name: 'Невыносимо',
    icon: GiSpikedDragonHead,
  },
} as const satisfies Record<(typeof difficulties)[number], { name: string; icon: IconType; words: number }>

const storeName = 'memo'
const memoStoreSchema = z.object({
  currentGame: memoGameSchema.nullable(),
  gamesPlayed: z.array(memoGameSchema),
  gameSettings: memoGameSchema.pick({ words: true, seed: true, difficulty: true }),
})
const defaultMemoStore: z.infer<typeof memoStoreSchema> = {
  currentGame: null,
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
