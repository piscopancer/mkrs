export type Word = Partial<{
  ch: string
  py: string
  ru: string
}>

export type Similar = { search: string; innerHTML: string }

export type Example = { heading: string; innerHtml: string }

export type BkrsResponseType = 'ch' | 'ru' | 'py' | 'ch-long' | 'english'

type BkrsResponseBase<T extends BkrsResponseType, O extends object> = { type: T } & O

type BkrsPageContentBase = Partial<{
  tr: string // .ch_ru | .ru
  startWith: string[] // #ru_from | #ch_from
  wordsWith: string[] // #words_start_with | #starting_container, #frequency_words_here
  inRu: Example[] // #ruch_fulltext
  inCh: string[] // #xinsheng_fullsearch
  synonyms: string[] // #synonyms_ru | #synonyms
  examples: Example[] // #examples
  found: true // #no-such-word | a[href*=add]
}>

export type BkrsResponses =
  | BkrsResponseBase<
      'ch',
      BkrsPageContentBase &
        Partial<{
          ch: string // #ch
          py: string // .py
          byWords: Word[] // .tbl_bywords
          backlinks: string[] // #backlinks
          similar: Similar[] // #ch_from_inside
        }>
    >
  | BkrsResponseBase<
      'ru',
      BkrsPageContentBase &
        Partial<{
          ru: string // #ru_ru
        }>
    >
  | BkrsResponseBase<'py', Partial<{ found: true; words: Word[] } | { found: false }>>
  | BkrsResponseBase<'ch-long', Partial<{ ch: string; byWords: Word[] }>>
  | BkrsResponseBase<'english', { ch: string | null }>

export type BkrsResponse<T extends BkrsResponseType> = BkrsResponses & { type: T }

export type BkrsResponseProps<T extends BkrsResponseType> = { response: BkrsResponse<T> }

export function determineBkrsSearchType(el: Element): BkrsResponseType {
  const hasCyrillic = !!(el.querySelector('#ru_ru')?.textContent ?? '').match(/\p{Script=Cyrillic}/gu)?.length
  if (el.querySelector('#py_search_py') && !el.querySelector('#no-such-word')) return 'py'
  if (el.querySelector('#ru_ru') && hasCyrillic) return 'ru'
  if (el.querySelector('#ch')) return 'ch'
  if (el.querySelector('#ch_long')) return 'ch-long'
  return 'english'
}

export function parseBkrsPage(el: HTMLElement, type: BkrsResponseType): BkrsResponses {
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
      english: {
        type: 'english',
        ch: el.querySelector('#ru_ru')?.textContent?.trim() ?? el.querySelector('#py_search_py')?.textContent?.trim() ?? null,
      },
    } satisfies Record<BkrsResponseType, BkrsResponses>
  )[type]
}

export const responsesDescriptions: Record<BkrsResponses['type'], string> = {
  ch: 'Поиск на китайском',
  py: 'Поиск по пининю',
  ru: 'Поиск на русском',
  'ch-long': 'Поиск по тексту',
  english: 'Поиск на английском',
}

export function parseWords(el: Element) {
  return Array.from(el.querySelectorAll('.tbl_bywords'))
    .map((table) => {
      const words: Word[] = []
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

export function parseWordsFromPinyin(el: Element, max?: number): Word[] {
  return Array.from(el.querySelectorAll('#py_table > tbody > tr'))
    .slice(0, max ?? Infinity)
    .map((row) => ({
      ch: row.querySelector('a')?.textContent?.trim() ?? '',
      py: row.querySelector('td.py_py')?.textContent?.trim() ?? '',
      ru: row.querySelector('td.py_ru')?.textContent?.trim() ?? '',
    }))
}

function parseExamples(el: Element): BkrsPageContentBase['examples'] {
  const examples = el.querySelector('#examples')
  if (!examples) return
  return Array.from(examples.children ?? [])
    .filter((ex) => ex.children[0] && ex.children[1])
    .map((ex) => ({
      heading: ex.children[0]?.textContent?.trim() ?? '-',
      innerHtml: ex.children[1]?.innerHTML,
    }))
}

function parseInRu(el: Element, _for: 'ch' | 'ru'): Example[] | undefined {
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

const findSuggestionsFunctions: { [T in BkrsResponseType]: (search: BkrsResponse<T>) => string[] | undefined } = {
  ch: (s) => s.startWith ?? s.wordsWith,
  ru: (s) => s.startWith ?? s.wordsWith,
  py: (s) => (s.found ? s.words && s.words.map((w) => w.ch?.trim() ?? '') : undefined),
  'ch-long': (s) => s.byWords?.map((w) => w.ch?.trim() ?? '') ?? undefined,
  english: () => undefined,
}

export function findSuggestions(search: BkrsResponses): string[] | undefined {
  return findSuggestionsFunctions[search.type](search as never)
}

export function parseSimilar(el: Element): Similar[] | undefined {
  return el.querySelector('#ch_from_inside')
    ? Array.from(el.querySelectorAll('#ch_from_inside a')).map((a) => ({
        innerHTML: a.innerHTML,
        search: a.textContent ?? '-',
      }))
    : undefined
}
