'use server'

import dictionary from '@/dictionary.json'
import { cookies } from 'next/headers'

export async function getRandomDictionaryWords() {
  cookies() // prevent caching
  const dict = dictionary as string[]
  const words: string[] = []
  for (let i = 0; i < 50; i++) {
    const pos = Math.floor(dict.length * Math.random())
    words.push(dict[pos])
  }
  return words
}
