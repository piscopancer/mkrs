import type { IconType } from 'react-icons'
import { TbScan } from 'react-icons/tb'
import { proxy } from 'valtio'
import { BkrsResponses } from './bkrs'

export const tools = {
  scanner: {
    name: 'сканер',
    icon: TbScan,
  },
} as const satisfies Record<string, { name: string; icon: IconType }>

export const searchStore = proxy({
  focused: false,
  search: '',
  bkrsResponse: undefined as BkrsResponses | undefined,
  showSuggestions: false,
  selectedSuggestion: -1,
  showTools: false as boolean,
  tool: 'scanner' as keyof typeof tools,
})
