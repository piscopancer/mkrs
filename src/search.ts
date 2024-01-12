import axios from 'axios'
import { project } from './project'

export type TResult = 'words' | 'ru-word' | 'ch-word' | 'suggest-from-pinyin' | 'pinyin-not-found' | 'suggest-from-ru' | 'error'
export type TResultProps = { el: Element }

export function determineSearchResult(el: Element): TResult {
  if (el.querySelector('.tbl_bywords')) return 'words'
  if (el.querySelector('#ch')) return 'ch-word'
  if (el.querySelector('#py_table')) return 'suggest-from-pinyin'
  if (el.querySelector('#py_search_py') && el.querySelector('#no-such-word')) return 'pinyin-not-found'
  if (el.querySelector('#ru_ru') && el.querySelector('#no-such-word')) return 'suggest-from-ru'
  if (el.querySelector('#ru_ru')) return 'ru-word'
  return 'error'
}

export const resultsDescriptions: Record<TResult, string> = {
  words: 'Выбор слова',
  'ru-word': 'Слово',
  'ch-word': '词语',
  'suggest-from-pinyin': 'Поиск по 拼音',
  'pinyin-not-found': '拼音 не найден',
  'suggest-from-ru': 'Поиск на русском',
  error: 'Ошибка',
}

export async function queryCharacter(ch: string) {
  const isServer = typeof window === 'undefined'
  const serverHost: Record<typeof process.env.NODE_ENV, string> = {
    development: 'http://localhost:3000',
    production: project.url,
    test: 'http://localhost:3000',
  }
  const host = isServer ? serverHost[process.env.NODE_ENV] : 'http://localhost:3000'

  const res = await axios.get<string>(`${host}/api/search`, { params: { ch } })
  return res.data
}
