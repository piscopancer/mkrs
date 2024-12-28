'use client'

import { layoutStore } from '@/app/()/store'
import { searchStore } from '@/search'
import { lastWordSelectorStore, selectedWordsStore } from '@/stores/selected-words'
import { autoUpdate, detectOverflow, FloatingPortal, Middleware, offset, Placement, shift, useFloating } from '@floating-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TbChevronDown, TbChevronUp, TbCopy, TbSearch, TbX } from 'react-icons/tb'

const detectMainContainerOverflow: Middleware = {
  name: 'detect-main-container-overflow',
  async fn(state) {
    const overflow = await detectOverflow(state, {
      rootBoundary: layoutStore.mainContainer.current.get()?.getBoundingClientRect() ?? 'viewport',
      padding: 4,
    })
    console.log(overflow)
    return {}
  },
}

export default function SelectedWordMenu() {
  const selectedWordsSnap = selectedWordsStore.use()
  const selectedTextSnap = selectedWordsStore.selectedText.use()
  const lastWordSelectorSnap = lastWordSelectorStore.ref.current.use()
  const mainContainerRect = layoutStore.mainContainer.current.use((el) => el?.getBoundingClientRect())
  const [placement, setPlacement] = useState<Placement>('top')
  const PlacementIcon = placement === 'top' ? TbChevronDown : TbChevronUp
  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    placement,
    middleware: [
      offset(16),
      shift({
        mainAxis: true,
        crossAxis: true,
        padding: 16,
        rootBoundary: mainContainerRect
          ? {
              x: mainContainerRect.x,
              y: mainContainerRect.y,
              height: mainContainerRect.height,
              width: mainContainerRect.width,
            }
          : 'viewport',
      }),
    ],
  })
  const router = useRouter()

  useEffect(() => {
    refs.setReference(lastWordSelectorSnap)
  }, [lastWordSelectorSnap])

  if (!selectedWordsSnap.words.length) {
    return null
  }

  return (
    <FloatingPortal>
      <article ref={refs.setFloating} style={floatingStyles} className='flex max-w-64 rounded-xl border-2 border-zinc-800/80 bg-zinc-900/50 outline outline-4 outline-zinc-900/50 max-md:bg-zinc-900/90 md:backdrop-blur-sm'>
        <p className='px-3 py-1'>{selectedTextSnap}</p>
        <menu className='flex'>
          <button
            onClick={() => {
              navigator.clipboard.writeText(selectedWordsStore.selectedText.get())
              selectedWordsStore.clearWords()
            }}
            className='flex p-2 text-zinc-200'
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
            className='flex p-2 text-zinc-200'
          >
            <TbSearch />
          </button>
          <button
            onClick={() => {
              selectedWordsStore.words.set((draft) => {
                draft.length = 0
              })
            }}
            className='flex border-r-2 border-zinc-800 p-2 text-zinc-200'
          >
            <TbX />
          </button>
          <button onClick={() => setPlacement((prev) => (prev === 'top' ? 'bottom' : 'top'))} className='bg-halftone flex rounded-md p-2 text-zinc-200'>
            <PlacementIcon />
          </button>
        </menu>
      </article>
    </FloatingPortal>
  )
}
