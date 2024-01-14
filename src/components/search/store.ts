import { TResult } from '@/search'
import { proxy, ref } from 'valtio'

export const searchStore = proxy({
  search: '',
  resText: '' as string,
  focused: false as boolean,
  selectedSuggestion: -1 as number,
  showSuggestion: false,
  suggestion: undefined as TResult | undefined,
})
