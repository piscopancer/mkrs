'use client'

import useShortcut from '@/hooks/use-key'
import { searchStore } from '@/search'
import { shortcuts } from '@/shortcuts'

export default function Copyer({ search }: { search: string }) {
  useShortcut([shortcuts.copy.keys, () => !searchStore.focused && navigator?.clipboard?.writeText(search)])
  return null
}
