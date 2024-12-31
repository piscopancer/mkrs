import { QueryClient } from '@tanstack/react-query'

export const qc = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
  },
})

export const queryKeys = {
  dictionary: ['dictionary'],
  search: (search: string) => ['search', search],
  reverso: (word: string) => ['reverso', word],
  bkrs: (word: string) => ['bkrs', word],
} as const
