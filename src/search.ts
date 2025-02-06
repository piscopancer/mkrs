import { store } from '@davstack/store'
import type { IconType } from 'react-icons'
import { TbScan } from 'react-icons/tb'
import { BkrsResponse, BkrsResponses, BkrsResponseType } from './bkrs'
import { ReversoResponse, ReversoResponses, ReversoResponseType } from './reverso'

export const tools = {
  scanner: {
    name: 'сканер',
    icon: TbScan,
  },
} as const satisfies Record<string, { name: string; icon: IconType }>

let debounceTimer: NodeJS.Timeout | null = null
const debouceTime = 500

export function sanitizeSearch(search: string) {
  return search.replace(/[\/:,.?!]/g, '').trim()
}

export const searchStore = store({
  focused: false,
  search: '',
  debouncedSearch: '',
  showSuggestions: false,
  selectedSuggestion: -1,
  showTools: false as boolean,
  tool: 'scanner' as keyof typeof tools,
})
  .actions((store) => ({
    completeDebounce() {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      store.debouncedSearch.set(store.search.get().trim())
    },
  }))
  .effects((store) => ({
    debounce() {
      return store.search.onChange((search) => {
        if (debounceTimer) {
          clearTimeout(debounceTimer)
        }
        const sanitizedSearch = sanitizeSearch(search)
        if (sanitizedSearch) {
          debounceTimer = setTimeout(() => {
            searchStore.debouncedSearch.set(sanitizedSearch)
          }, debouceTime)
        } else {
          searchStore.debouncedSearch.set(sanitizedSearch)
        }
      })
    },
  }))

const _findSuggestions: { [T in BkrsResponseType]: (search: BkrsResponse<T>) => string[] | undefined } & {
  [T in ReversoResponseType]: (search: ReversoResponse<T>) => string[] | undefined
} = {
  ch: (res) => res.startWith ?? res.wordsWith,
  ru: (res) => res.startWith ?? res.wordsWith,
  py: (res) => (res.found ? res.words && res.words.map((w) => w.ch?.trim() ?? '') : undefined),
  'ch-long': (res) => res.segments.cards?.map((c) => c.ch?.trim() ?? '') ?? undefined,
  english: () => undefined,
  error: () => undefined,
  many: (res) => res.translations ?? undefined,
  one: (res) => res.translations ?? undefined,
}

export function findSuggestions(res: BkrsResponses | ReversoResponses): string[] | undefined {
  return _findSuggestions[res.type](res as never)
}

export type Response = ReversoResponse<ReversoResponseType> | BkrsResponse<BkrsResponseType>
export type ResponseType = BkrsResponseType | ReversoResponseType
export type ResponseProps = {
  response: Response
}
