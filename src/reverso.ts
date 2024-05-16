export type SearchType = 'one' | 'many' | 'not-found'

type BaseSearch<T extends SearchType, O extends object> = { type: T } & O

export type Searches =
  | BaseSearch<
      'one',
      {
        words: string[]
      }
    >
  | BaseSearch<'many', {}>
  | BaseSearch<'not-found', {}>

export type Search<T extends SearchType> = Searches & { type: T }

export type SearchProps<T extends SearchType> = { search: Search<T> }

function determineSearchType(el: Element): SearchType {
  if (el.querySelector('#translations-content')) return 'one'
  if (el.querySelector('#splitting-content')) return 'many'
  return 'not-found'
}

export function parseReverso(reversoHtml: Element): Searches {
  const type = determineSearchType(reversoHtml)
  switch (type) {
    case 'one':
      return {
        type: 'one',
        words: Array.from(reversoHtml.querySelector('#translations-content')?.querySelectorAll('a.translation') ?? []).map((tr) => tr.textContent?.trim()!),
      }
    case 'many':
      return {
        type: 'many',
      }
    case 'not-found':
      return {
        type: 'not-found',
      }
  }
}

export async function queryCharacterReverso(ch: string) {
  return fetch(`https://context.reverso.net/translation/chinese-english/${ch}`, { next: { revalidate: 60 * 60 * 24 * 7 } }).then((res) => res.text())
}
