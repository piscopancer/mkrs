import { IconType } from 'react-icons'
import { GiBearHead, GiDirewolf, GiSpikedDragonHead } from 'react-icons/gi'
import { TbCheck, TbPlayerPause, TbPlayerPlay, TbX } from 'react-icons/tb'
import { z } from 'zod'
import { memoStore } from './stores/memo'

const difficulties = ['easy', 'medium', 'hard'] as const
const states = ['active', 'paused', 'cancelled', 'completed'] as const

export const statesInfo = {
  active: { name: 'Активно', icon: TbPlayerPlay },
  paused: { name: 'Приостановлено', icon: TbPlayerPause },
  cancelled: { name: 'Отменено', icon: TbX },
  completed: { name: 'Завершено', icon: TbCheck },
} satisfies Record<(typeof states)[number], { name: string; icon: IconType }>

export const memoGameSchema = z.object({
  id: z.string(),
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
