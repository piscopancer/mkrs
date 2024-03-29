import { proxy } from 'valtio'
import { route } from './utils'

export const searchStore = proxy({
  focused: false,
  inputValue: '',
  search: undefined as TSearches | undefined,
  showSuggestions: false,
  selectedSuggestion: -1,
  showHandwriting: false as boolean,
})

export type TWord = Partial<{
  ch: string
  py: string
  ru: string
}>

export type TSimilar = { search: string; innerHTML: string }

export type TExample = { heading: string; innerHtml: string }

export type TSearchType = 'ch' | 'ru' | 'py' | 'ch-long' | 'error'

type TSearchBase<T extends TSearchType, O extends object> = { type: T } & O

type TSearchResults = Partial<{
  tr: string // .ch_ru | .ru
  startWith: string[] // #ru_from | #ch_from
  wordsWith: string[] // #words_start_with | #starting_container, #frequency_words_here
  inRu: TExample[] // #ruch_fulltext
  inCh: string[] // #xinsheng_fullsearch
  synonyms: string[] // #synonyms_ru | #synonyms
  examples: TExample[] // #examples
  found: true // #no-such-word | a[href*=add]
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
          similar: TSimilar[] // #ch_from_inside
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
  | TSearchBase<'ch-long', Partial<{ ch: string; byWords: TWord[] }>>
  | TSearchBase<'error', {}>

export type TSearch<T extends TSearchType> = TSearches & { type: T }

export type TSearchProps<T extends TSearchType> = { search: TSearch<T> }

export function determineSearchType(el: Element): TSearchType {
  if (el.querySelector('#py_search_py')) return 'py'
  if (el.querySelector('#ru_ru')) return 'ru'
  if (el.querySelector('#ch')) return 'ch'
  if (el.querySelector('#ch_long')) return 'ch-long'
  return 'error'
}

export function parse(el: Element, type: TSearchType): TSearches {
  return (
    {
      ch: {
        type: 'ch',
        ch: el.querySelector('#ch')?.innerHTML.trim() ?? undefined,
        py: el.querySelector('.py')?.textContent?.trim() ?? undefined,
        tr: el.querySelector('.ru')?.innerHTML.trim() ?? undefined,
        startWith: el.querySelector('#ch_from') ? Array.from(el.querySelectorAll('#ch_from a')).map((a) => a.textContent?.trim() ?? '') : undefined,
        wordsWith: el.querySelector('#starting_container')
          ? Array.from(el.querySelectorAll('#starting_container a')).map((a) => a.textContent?.trim() ?? '')
          : el.querySelector('#frequency_words_here')
            ? Array.from(el.querySelectorAll('#frequency_words_here a')).map((a) => a.textContent?.trim() ?? '')
            : undefined,
        inRu: parseInRu(el, 'ch'),
        byWords: (el.querySelector('.tbl_bywords') && parseWords(el)) ?? undefined,
        examples: parseExamples(el),
        similar: parseSimilar(el),
        found: el.querySelector('a[href*=add]') ? undefined : true,
      },
      ru: {
        type: 'ru',
        ru: el.querySelector('#ru_ru')?.innerHTML.trim() ?? undefined,
        tr: !!!el.querySelector('#no-such-word') ? el.querySelector('.ch_ru')?.innerHTML.trim() : undefined ?? undefined,
        found: el.querySelector('#no-such-word') ? undefined : true,
        startWith: el.querySelector('#ru_from') ? Array.from(el.querySelectorAll('#ru_from a')).map((a) => a.textContent?.trim() ?? '') : undefined,
        wordsWith: el.querySelector('#words_start_with') ? Array.from(el.querySelectorAll('#words_start_with a')).map((a) => a.textContent?.trim() ?? '') : undefined,
        inRu: parseInRu(el, 'ru'),
        examples: parseExamples(el),
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
  ch: 'Поиск на китайском',
  py: 'Поиск по пининю',
  ru: 'Поиск на русском',
  'ch-long': 'Поиск по тексту',
  error: 'Ошибка поиска',
}

export let abortController: AbortController | null = new AbortController()

export async function queryCharacterClient(ch: string) {
  if (abortController) {
    abortController.abort()
    abortController = new AbortController()
  }
  abortController = new AbortController()
  const res = await fetch(route('/api/search', { ch }), { signal: abortController.signal })
  abortController = null
  return res.text()
}

export async function queryCharacter(ch: string) {
  return fetch(`https://bkrs.info/slovo.php?ch=${ch}`, { next: { revalidate: 60 * 60 * 24 * 7 } }).then((res) => res.text())
}

export function parseWords(el: Element) {
  return Array.from(el.querySelectorAll('.tbl_bywords'))
    .map((table) => {
      const words: TWord[] = []
      for (let i = 0; i < 4; i++) {
        words.push({
          ch: table.querySelector(`tr:nth-child(1) td:nth-child(${i + 1})`)?.textContent?.trim() ?? '',
          py: table.querySelector(`tr:nth-child(2) td:nth-child(${i + 1}) > :nth-child(1)`)?.textContent?.trim() ?? '',
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
      ch: row.querySelector('a')?.textContent?.trim() ?? '',
      py: row.querySelector('td.py_py')?.textContent?.trim() ?? '',
      ru: row.querySelector('td.py_ru')?.textContent?.trim() ?? '',
    }))
}

function parseExamples(el: Element): TSearchResults['examples'] {
  const examples = el.querySelector('#examples')
  if (!examples) return
  return Array.from(examples.children ?? [])
    .filter((ex) => ex.children[0] && ex.children[1])
    .map((ex) => ({
      heading: ex.children[0]?.textContent?.trim() ?? '-',
      innerHtml: ex.children[1]?.innerHTML,
    }))
}

function parseInRu(el: Element, _for: 'ch' | 'ru'): TExample[] | undefined {
  const id = _for === 'ch' ? '#ruch_fulltext' : '#ruch_fullsearch'
  return el.querySelector(id)
    ? Array.from(el.querySelectorAll(`${id} > *`)).map((ch) => {
        if (Array.from(ch.children).length) {
          const _ch = ch.cloneNode(true) as Element
          _ch.querySelector('a')?.remove()
          return {
            heading: ch.children[0]?.textContent?.trim() ?? '',
            innerHtml: _ch.innerHTML,
          }
        } else return { innerHtml: '', heading: '' }
      })
    : undefined
}

const findSuggestionsFunctions: { [T in TSearchType]: (search: TSearch<T>) => string[] | undefined } = {
  ch: (s) => s.startWith ?? s.wordsWith,
  ru: (s) => s.startWith ?? s.wordsWith,
  py: (s) => (s.found ? s.words && s.words.map((w) => w.ch?.trim() ?? '') : undefined),
  'ch-long': (s) => s.byWords?.map((w) => w.ch?.trim() ?? '') ?? undefined,
  error: () => undefined,
}

export function findSuggestions(search: TSearches) {
  return findSuggestionsFunctions[search.type](search as never)
}

export function parseSimilar(el: Element): TSimilar[] | undefined {
  return el.querySelector('#ch_from_inside')
    ? Array.from(el.querySelectorAll('#ch_from_inside a')).map((a) => ({
        innerHTML: a.innerHTML,
        search: a.textContent ?? '-',
      }))
    : undefined
}
