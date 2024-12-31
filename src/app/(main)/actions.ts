'use server'

import dalsDictionary from '@/dals-dictionary.json'

export async function getRandomDictionaryWords() {
  const words: string[] = []
  for (let i = 0; i < 10; i++) {
    const pos = Math.floor(dalsDictionary.length * Math.random())
    words.push(dalsDictionary[pos])
  }
  return words
}
