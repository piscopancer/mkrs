import { QueryClient } from '@tanstack/react-query'

export const qc = new QueryClient()

export const queryKeys = {
  reverso: (word: string) => ['reverso', word],
} as const
