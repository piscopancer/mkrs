import axios from 'axios'
import { project } from './project'

export type TResult = 'words' | 'ru-word' | 'ch-word' | 'suggest-from-pinyin' | 'pinyin-not-found' | 'suggest-from-ru' | 'error'
export type TResultProps = { el: Element }

export function determineSearchResult(el: Element): TResult {
  if (el.querySelector('#ch') && el.querySelector('.py')) return 'ch-word'
  if (el.querySelector('.tbl_bywords')) return 'words'
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

export function parseWords(el: Element) {
  return Array.from(el.querySelectorAll('.tbl_bywords'))
    .map((table) => {
      const results: { ch: string; py: string; ru: string[] }[] = []
      for (let i = 0; i < 4; i++) {
        results.push({
          ch: table.querySelector(`tr:nth-child(1) td:nth-child(${i + 1})`)?.textContent ?? '',
          py: table.querySelector(`tr:nth-child(2) td:nth-child(${i + 1}) > :nth-child(1)`)?.textContent ?? '',
          ru: Array.from(table.querySelectorAll(`tr:nth-child(2) td:nth-child(${i + 1}) > :nth-child(n + 2)`)).map((el) => el.outerHTML),
        })
      }
      return results
    })
    .flat(1)
}

export function parseSuggestFromPinyin(el: Element, maxResults: number) {
  return Array.from(el.querySelectorAll('#py_table > tbody > tr'))
    .slice(0, maxResults)
    .map((row) => ({
      ch: row.querySelector('a')?.textContent || '',
      py: row.querySelector('td.py_py')?.textContent || '',
      ru: row.querySelector('td.py_ru')?.textContent || '',
    }))
}
