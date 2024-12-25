import { BkrsResponses } from '@/bkrs'
import { ReversoResponses } from '@/reverso'
import { searchStore } from '@/search'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export type TExact = { ch: string; tr: string } | undefined

export function findExact(search: BkrsResponses | ReversoResponses): TExact {
  if (search.type === 'ch') {
    if (search.tr)
      return {
        ch: search.ch ?? '',
        tr: search.tr ?? '',
      }
  }
  if (search.type === 'ru') {
    if (search.found)
      return {
        ch: search.ru ?? '',
        tr: search.tr ?? '',
      }
  }
  return undefined
}

export function selectSuggestion(router: AppRouterInstance, ch: string) {
  router.push(`/search/${ch}`)
  searchStore.focused.set(false)
  searchStore.showSuggestions.set(false)
}
