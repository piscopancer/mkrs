'use client'

import { lastSelectedStore, selectedWordsStore } from '@/stores/selected-words'
import { autoUpdate, FloatingPortal, useFloating } from '@floating-ui/react'
import { useEffect } from 'react'
import { useSnapshot } from 'valtio'

export default function SelectedWordMenu() {
  const selectedWordsSnap = selectedWordsStore.use()
  const lastSelectedSnap = useSnapshot(lastSelectedStore)
  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    middleware: [],
  })

  useEffect(() => {
    refs.setReference(lastSelectedStore.buttonRef ?? null)
  }, [lastSelectedSnap.buttonRef])

  if (!selectedWordsSnap.words.length) {
    return null
  }

  return (
    <FloatingPortal>
      <article ref={refs.setFloating} style={floatingStyles} className='rounded-full border-2 border-zinc-800 bg-zinc-900 p-1'>
        <p>{selectedWordsSnap.words.map((w) => w.word).join('')}</p>
        <button></button>
        <pre className='text-xs'>{JSON.stringify(selectedWordsStore.get())}</pre>
      </article>
    </FloatingPortal>
  )
}
