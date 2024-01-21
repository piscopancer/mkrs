import { proxy } from 'valtio'

export const searchStore = proxy({
  focused: false,
  inputValue: '',
  search: undefined as TSearches | undefined,
  showSuggestions: false,
  selectedSuggestion: -1,
})

export type TWord = Partial<{
  ch: string
  py: string
  ru: string
}>

export type TExample = { heading: string; content: string }

export type TSearchType = 'ch' | 'ru' | 'py' | 'ch-long' | 'error'

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
          found: true // #no-such-word
        }>
    >
  | TSearchBase<'py', Partial<{ found: true; words: TWord[] } | { found: false }>>
  | TSearchBase<'ch-long', Partial<{ ch: string; byWords: TWord[] }>>
  | TSearchBase<'error', {}>

export type TSearch<T extends TSearchType> = TSearches & { type: T }

export type TSearchProps<T extends TSearchType> = { search: TSearch<T> }

export function determineSearchType(el: Element): TSearchType {
  if (el.querySelector('#py_search_py')) return 'py'
  if (el.querySelector('#ru_ru')) return 'ru'
  if (el.querySelector('#ch') && el.querySelector('.py')) return 'ch'
  if (el.querySelector('#ch_long')) return 'ch-long'
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
        inRu: parseInRu(el),
        byWords: (el.querySelector('.tbl_bywords') && parseWords(el)) ?? undefined,
      },
      ru: {
        type: 'ru',
        ru: el.querySelector('#ru_ru')?.innerHTML ?? undefined,
        tr: !!!el.querySelector('#no-such-word') ? el.querySelector('.ch_ru')?.innerHTML : undefined ?? undefined,
        found: el.querySelector('#no-such-word') ? undefined : true,
        startWith: el.querySelector('#ru_from') ? Array.from(el.querySelectorAll('#ru_from a')).map((a) => a.textContent ?? '') : undefined,
        wordsWith: el.querySelector('#words_start_with') ? Array.from(el.querySelectorAll('#words_start_with a')).map((a) => a.textContent ?? '') : undefined,
        inRu: parseInRu(el),
      },
      py: {
        type: 'py',
        words: parseWordsFromPinyin(el),
        found: !!!el.querySelector('#no-such-word'),
      },
      'ch-long': {
        type: 'ch-long',
        byWords: (el.querySelector('.tbl_bywords') && parseWords(el)) ?? undefined,
      },
      error: { type: 'error' },
    } satisfies Record<TSearchType, TSearches>
  )[type]
}

export const searchDescriptions: Record<TSearches['type'], string> = {
  ch: 'Поиск по китайскому',
  py: 'Поиск по пининю',
  ru: 'Поиск по русскому',
  'ch-long': 'Поиск по тексту',
  error: 'Ошибка',
}

export let abortController: AbortController | null = null

export async function queryCharacter(ch: string) {
  const url = new URL(process.env.NEXT_PUBLIC_URL)
  url.pathname = '/api/search'
  url.searchParams.set('ch', ch)
  abortController = new AbortController()
  const res = await fetch(url, { signal: abortController.signal })
  abortController = null
  return res.text()
}

export function parseWords(el: Element) {
  return Array.from(el.querySelectorAll('.tbl_bywords'))
    .map((table) => {
      const words: TWord[] = []
      for (let i = 0; i < 4; i++) {
        words.push({
          ch: table.querySelector(`tr:nth-child(1) td:nth-child(${i + 1})`)?.textContent ?? '',
          py: table.querySelector(`tr:nth-child(2) td:nth-child(${i + 1}) > :nth-child(1)`)?.textContent ?? '',
          ru: parseRu(table, i),
        })
      }
      return words.filter((w) => w.ch && w.py)
    })
    .flat(1)

  function parseRu(table: Element, i: number) {
    const _ru = table.querySelector(`tr:nth-child(2) td:nth-child(${i + 1})`)
    if (_ru) {
      const ru = _ru.cloneNode(true) as Element
      ru.querySelector('center:nth-child(1)')?.remove()
      return ru.innerHTML
    }
  }
}

export function parseWordsFromPinyin(el: Element, max?: number): TWord[] {
  return Array.from(el.querySelectorAll('#py_table > tbody > tr'))
    .slice(0, max ?? Infinity)
    .map((row) => ({
      ch: row.querySelector('a')?.textContent ?? '',
      py: row.querySelector('td.py_py')?.textContent ?? '',
      ru: row.querySelector('td.py_ru')?.textContent ?? '',
    }))
}

function parseInRu(el: Element) {
  return el.querySelector('#ruch_fullsearch')
    ? Array.from(el.querySelectorAll('#ruch_fullsearch > *')).map((ch) => {
        if (Array.from(ch.children).length) {
          return {
            heading: ch.children[0]?.textContent ?? '',
            content: ch.children[1]?.outerHTML ?? '',
          }
        } else return { content: '', heading: '' }
      })
    : undefined
}

const findSuggestionsFunctions: { [T in TSearchType]: (search: TSearch<T>) => string[] | undefined } = {
  ch: (s) => s.startWith ?? s.wordsWith,
  ru: (s) => s.startWith ?? s.wordsWith,
  py: (s) => (s.found ? s.words && s.words.map((w) => w.ch ?? '') : undefined),
  'ch-long': (s) => s.byWords?.map((w) => w.ch ?? '') ?? undefined,
  error: () => undefined,
}

export function findSuggestions(search: TSearches) {
  return findSuggestionsFunctions[search.type](search as never)
}
