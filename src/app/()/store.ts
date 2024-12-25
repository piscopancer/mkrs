import { store } from '@davstack/store'
import { RefObject } from 'react'

export const layoutStore = store({
  mainContainer: null as RefObject<HTMLDivElement> | null,
})
