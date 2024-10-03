import { RefObject } from 'react'
import { proxy, ref } from 'valtio'

export const layoutStore = proxy({
  mainContainer: null as ReturnType<typeof ref<RefObject<HTMLDivElement>>> | null,
})
