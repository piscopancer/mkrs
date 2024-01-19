import axios from 'axios'
import { project } from './project'

export type TWord = Partial<{
  ch: string
  py: string
  ru: string
}>

export type TExample = { heading: string; content: string }

export type TSearchType = 'ch' | 'ru' | 'py' | 'error'

type TSearchBase<T extends TSearchType, O extends object> = { type: T } & O

type TSearchResults = Partial<{
  tr: string // .ch_ru | .ru
  startWith: string[] // #ru_from | #ch_from
  wordsWith: string[] // #words_start_with | #starting_container, #frequency_words_here
  inRu: TExample[] // #ruch_fulltext
  inCh: string[] // #xinsheng_fullsearch
  synonyms: string[] // #synonyms_ru | #synonyms
  examples: string // #examples
}>

export type TSearches =
  | TSearchBase<
      'ch',
      TSearchResults &
        Partial<{
          ch: string // #ch
          py: string // .py
          byWords: TWord[] // .tbl_bywords
          backlinks: string[] // #backlinks
        }>
    >
  | TSearchBase<
      'ru',
      TSearchResults &
        Partial<{
          ru: string // #ru_ru
        }>
    >
  | TSearchBase<'py', Partial<{ found: true; words: TWord[] } | { found: false }>>
  | TSearchBase<'error', {}>

export type TSearch<T extends TSearchType> = TSearches & { type: T }

export type TSearchProps<T extends TSearchType> = { search: TSearch<T> }

export function determineSearchType(el: Element): TSearchType {
  if (el.querySelector('#py_search_py')) return 'py'
  if (el.querySelector('#ru_ru')) return 'ru'
  if (el.querySelector('#ch') && el.querySelector('.py')) return 'ch'
  return 'error'
}

export function parse(el: Element, type: TSearchType): TSearches {
  return (
    {
      ch: {
        type: 'ch',
        ch: el.querySelector('#ch')?.innerHTML ?? undefined,
        py: el.querySelector('.py')?.textContent ?? undefined,
        tr: el.querySelector('.ru')?.innerHTML ?? undefined,
        startWith: el.querySelector('#ch_from') ? Array.from(el.querySelectorAll('#ch_from a')).map((a) => a.textContent ?? '') : undefined,
        wordsWith: el.querySelector('#starting_container') ? Array.from(el.querySelectorAll('#starting_container a')).map((a) => a.textContent ?? '') : el.querySelector('#frequency_words_here') ? Array.from(el.querySelectorAll('#frequency_words_here a')).map((a) => a.textContent ?? '') : undefined,
        inRu: el.querySelector('#ruch_fulltext')
          ? Array.from(el.querySelectorAll('#ruch_fulltext > *')).map((ch) => {
              if (Array.from(ch.children).length) {
                return {
                  heading: ch.children[0]?.textContent ?? '',
                  content: ch.children[1]?.outerHTML ?? '',
                }
              } else return { content: '', heading: '' }
            })
          : [],
      },
      ru: {
        type: 'ru',
        ru: el.querySelector('#ru_ru')?.innerHTML ?? undefined,
        tr: el.querySelector('.ch_ru')?.innerHTML ?? undefined,
        startWith: el.querySelector('#ru_from') ? Array.from(el.querySelectorAll('#ru_from a')).map((a) => a.textContent ?? '') : undefined,
        wordsWith: el.querySelector('#words_start_with') ? Array.from(el.querySelectorAll('#words_start_with a')).map((a) => a.textContent ?? '') : undefined,
      },
      py: {
        type: 'py',
        words: parseWordsFromPinyin(el),
        found: !!el.querySelector('#py_table'),
      },
      error: { type: 'error' },
    } satisfies Record<TSearchType, TSearches>
  )[type]
}

export const resultsDescriptions: Record<TSearches['type'], string> = {
  ch: 'Поиск по китайскому',
  py: 'Поиск по пининю',
  ru: 'Поиск по русскому',
  error: 'Ошибка',
}

export async function queryCharacter(ch: string) {
  const res = await axios.get<string>(`${process.env.NEXT_PUBLIC_URL}/api/search`, { params: { ch } })
  return res.data
}

// export function parseWords(el: Element) {
//   return Array.from(el.querySelectorAll('.tbl_bywords'))
//     .map((table) => {
//       const results: { ch: string; py: string; ru: string[] }[] = []
//       for (let i = 0; i < 4; i++) {
//         results.push({
//           ch: table.querySelector(`tr:nth-child(1) td:nth-child(${i + 1})`)?.textContent ?? '',
//           py: table.querySelector(`tr:nth-child(2) td:nth-child(${i + 1}) > :nth-child(1)`)?.textContent ?? '',
//           ru: Array.from(table.querySelectorAll(`tr:nth-child(2) td:nth-child(${i + 1}) > :nth-child(n + 2)`)).map((el) => el.outerHTML),
//         })
//       }
//       return results
//     })
//     .flat(1)
// }

export function parseWordsFromPinyin(el: Element, max?: number): TWord[] {
  return Array.from(el.querySelectorAll('#py_table > tbody > tr'))
    .slice(0, max ?? Infinity)
    .map((row) => ({
      ch: row.querySelector('a')?.textContent ?? '',
      py: row.querySelector('td.py_py')?.textContent ?? '',
      ru: row.querySelector('td.py_ru')?.textContent ?? '',
    }))
}

// export function parseSuggestFromRu(el: Element, max?: number) {
//   return Array.from(el.querySelectorAll('#ru_from a'))
//     .map((a) => ({
//       startsWith: a?.textContent ?? '',
//     }))
//     .slice(0, max ?? Infinity)
// }
