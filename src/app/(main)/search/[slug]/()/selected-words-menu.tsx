'use client'

import { searchStore } from '@/search'
import { lastSelectedStore, selectedWordsStore } from '@/stores/selected-words'
import { autoUpdate, flip, FloatingPortal, offset, useFloating } from '@floating-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { TbCopy, TbSearch, TbX } from 'react-icons/tb'
import { useSnapshot } from 'valtio'

export default function SelectedWordMenu() {
  const selectedWordsSnap = selectedWordsStore.use()
  const selectedTextSnap = selectedWordsStore.selectedText.use()
  const lastSelectedSnap = useSnapshot(lastSelectedStore)
  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: 'top',
    middleware: [flip(), offset(8)],
  })
  const router = useRouter()

  useEffect(() => {
    refs.setReference(lastSelectedStore.buttonRef ?? null)
  }, [lastSelectedSnap.buttonRef])

  if (!selectedWordsSnap.words.length) {
    return null
  }

  return (
    <FloatingPortal>
      <article ref={refs.setFloating} style={floatingStyles} className='flex max-w-64 items-center rounded-xl border-2 border-zinc-800 bg-zinc-900 p-1 outline outline-4 outline-zinc-900/50 max-md:max-w-[calc(100vw-theme(spacing.4))]'>
        <p className='px-3'>{selectedTextSnap}</p>
        <menu className='flex self-start'>
          <button
            onClick={() => {
              navigator.clipboard.writeText(selectedWordsStore.selectedText.get())
              selectedWordsStore.clearWords()
            }}
            className='flex aspect-square size-8 items-center justify-center rounded-md text-zinc-200 hover:bg-zinc-800'
          >
            <TbCopy />
          </button>
          <button
            onClick={() => {
              searchStore.search.set(selectedWordsStore.selectedText.get())
              router.push(`/search/${selectedWordsStore.selectedText.get()}`)
              selectedWordsStore.clearWords()
              searchStore.focused.set(false)
              searchStore.showSuggestions.set(false)
            }}
            className='flex aspect-square size-8 items-center justify-center rounded-md text-zinc-200 hover:bg-zinc-800'
          >
            <TbSearch />
          </button>
          <button
            onClick={() => {
              selectedWordsStore.words.set((draft) => {
                draft.length = 0
              })
            }}
            className='flex aspect-square size-8 items-center justify-center rounded-md text-zinc-200 hover:bg-zinc-800'
          >
            <TbX />
          </button>
        </menu>
      </article>
    </FloatingPortal>
  )
}
