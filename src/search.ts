import type { IconType } from 'react-icons'
import { TbScan } from 'react-icons/tb'
// import { proxy } from 'valtio'
import { store } from '@davstack/store'
import { BkrsResponse, BkrsResponses, BkrsResponseType } from './bkrs'
import { ReversoResponse, ReversoResponses, ReversoResponseType } from './reverso'

export const tools = {
  scanner: {
    name: 'сканер',
    icon: TbScan,
  },
} as const satisfies Record<string, { name: string; icon: IconType }>

export const searchStore = store({
  focused: false,
  search: '',
  response: undefined as BkrsResponses | ReversoResponses | undefined,
  showSuggestions: false,
  selectedSuggestion: -1,
  showTools: false as boolean,
  tool: 'scanner' as keyof typeof tools,
})

const _findSuggestions: { [T in BkrsResponseType]: (search: BkrsResponse<T>) => string[] | undefined } & {
  [T in ReversoResponseType]: (search: ReversoResponse<T>) => string[] | undefined
} = {
  ch: (res) => res.startWith ?? res.wordsWith,
  ru: (res) => res.startWith ?? res.wordsWith,
  py: (res) => (res.found ? res.words && res.words.map((w) => w.ch?.trim() ?? '') : undefined),
  'ch-long': (res) => res.byWords?.map((w) => w.ch?.trim() ?? '') ?? undefined,
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
