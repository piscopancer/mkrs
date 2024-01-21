import { TSearches, searchStore } from '@/search'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useSnapshot } from 'valtio'

export function findExact(search: ReturnType<typeof useSnapshot<TSearches>>) {
  if (search.type === 'ch') {
    if (search.tr) return search.ch
  }
  if (search.type === 'ru') {
    if (search.found) return search.ru
  }
  return null
}

export function selectSuggestion(router: AppRouterInstance, ch: string) {
  router.push(`/search/${ch}`)
  searchStore.focused = false
  searchStore.showSuggestions = false
}
