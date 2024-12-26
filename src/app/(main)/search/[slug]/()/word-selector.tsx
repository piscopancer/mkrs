'use client'

import { lastWordSelectorStore, selectedWordsStore } from '@/stores/selected-words'
import clsx from 'clsx'
import { ComponentProps, useRef } from 'react'

type WordSelectorProps = ComponentProps<'button'> & {
  wordId: number
  word: string
}

function createId(index: number) {
  return `word-selector-${index}`
}

// TODO: use virual from floating-ui on the last index to show the popover. Esc closes the popover and clears the words
// Add tooltip with translation from react query

export default function WordSelector({ word, wordId, ...props }: WordSelectorProps) {
  const wordSnap = selectedWordsStore.words.use().find((w) => w.id === wordId)
  const index = wordSnap ? selectedWordsStore.words.get().indexOf(wordSnap) : null
  const selfRef = useRef<HTMLButtonElement>(null!)

  function interact() {
    selectedWordsStore.words.set((draft) => {
      if (index === null) {
        draft.push({ word, id: wordId })
        lastWordSelectorStore.ref.current.set(selfRef.current)
      } else {
        if (index === 0) {
          while (draft.length) {
            draft.pop()
          }
        } else {
          draft.splice(index, draft.length - 1)
          const lastBtn = document.querySelector(`#${createId(index - 1)}`) as HTMLButtonElement
          lastWordSelectorStore.ref.current.set(lastBtn)
        }
      }
    })
  }

  return (
    <button
      id={index !== null ? createId(index) : undefined}
      ref={selfRef}
      onPointerEnter={(e) => {
        if (e.buttons === 1) {
          interact()
        }
      }}
      onPointerDown={interact}
      className={clsx('group relative inline-block duration-100', wordSnap ? 'text-zinc-200' : '')}
    >
      <div className={clsx('duration-100 ease-in-out', 'group-hover:-translate-y-0.5')}>{props.children}</div>
      {index !== null && (
        <div className='hopper pointer-events-none absolute inset-0'>
          <div className='motion-preset-pop absolute aspect-square w-[calc(100%+1rem)] self-center justify-self-center rounded-full bg-zinc-200/10' />
          <span className='motion-preset-blur-down-sm -mt-4 self-start justify-self-center rounded-md border-2 border-zinc-800 bg-zinc-200 px-1 font-mono text-xs font-bold text-zinc-800 motion-translate-y-loop-[-2px]/mirror motion-duration-1000/translate motion-ease-in-out-cubic/translate'>
            {index + 1}
          </span>
        </div>
      )}
    </button>
  )
}
