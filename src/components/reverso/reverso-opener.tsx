'use client'

import useHotkey from '@/hooks/use-hotkey'
import { hotkeys } from '@/hotkeys'
import { searchStore } from '@/search'
import { useSnapshot } from 'valtio'

export default function ReversoOpener(props: { ch: string }) {
  const searchSnap = useSnapshot(searchStore)
  useHotkey(hotkeys.reverso.keys, (_, e) => {
    if (!searchSnap.focused && !e.ctrlKey) window.open(`https://context.reverso.net/translation/chinese-english/${props.ch}`, '_blank')?.focus()
  })
  return null
}
