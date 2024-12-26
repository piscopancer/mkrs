import { store } from '@davstack/store'
import { createRef, RefObject } from 'react'

export const layoutStore = store({
  mainContainer: createRef() as RefObject<HTMLDivElement>,
})
