import { store } from '@davstack/store'
import { proxy, ref } from 'valtio'

// after having selected 10 words, if word number 8 is clicked, remove 8, 9, 10

type SelectedWord = {
  id: number
  word: string
}

const defaultSelectedWordsStore = {
  words: [] as SelectedWord[],
}

export const lastSelectedStore = proxy({
  buttonRef: null as ReturnType<typeof ref<HTMLButtonElement>> | null,
})

export const selectedWordsStore = store(defaultSelectedWordsStore)
