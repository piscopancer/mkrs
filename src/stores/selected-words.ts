import { store } from '@davstack/store'
import { createRef, RefObject } from 'react'

type SelectedWord = {
  id: number
  word: string
}

export const lastWordSelectorStore = store({
  ref: createRef() as RefObject<HTMLButtonElement>,
})

export const selectedWordsStore = store({
  words: [] as SelectedWord[],
})
  .actions((store) => ({
    clearWords() {
      store.words.set((draft) => {
        draft.length = 0
      })
    },
  }))
  .computed((store) => ({
    selectedText() {
      return store.words
        .get()
        .map((w) => w.word)
        .join('')
    },
  }))
