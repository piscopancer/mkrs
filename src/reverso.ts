export type SearchType = 'one' | 'many' | 'error'
import { JSDOM } from 'jsdom'

type BaseSearch<T extends SearchType, O extends object> = { type: T } & O
export type Example = { original: string; translation: string }

export type Searches =
  | (BaseSearch<
      'one',
      {
        translations: string[]
      }
    > & { examples: Example[] | null })
  | (BaseSearch<
      'many',
      {
        translations: string[]
        groups: { original: string; translations: string[] }[]
      }
    > & { examples: Example[] | null })
  | BaseSearch<'error', {}>

export type Search<T extends SearchType> = Searches & { type: T }

export type SearchProps<T extends SearchType> = { search: Search<T> }

function determineSearchType(el: Element): SearchType {
  if (el.querySelector('#translations-content') && !el.querySelector('#splitting-content')) return 'one'
  if (el.querySelector('#splitting-content')) return 'many'
  return 'error'
}

export function parseReverso(reversoHtml: Element): Searches {
  const type = determineSearchType(reversoHtml)
  switch (type) {
    case 'one':
      return {
        type: 'one',
        translations: Array.from(reversoHtml.querySelector('#translations-content')!.querySelectorAll('.translation')).map((tr) => tr.textContent!.trim()),
        examples: parseExamples(reversoHtml),
      }
    case 'many':
      return {
        type: 'many',
        translations: Array.from(reversoHtml.querySelector('#translations-content')!.querySelectorAll('.translation')).map((tr) => tr.textContent!.trim()),
        groups: Array.from(reversoHtml.querySelectorAll('#splitting-content > .split')!).map((groupEl) => ({
          original: groupEl.querySelector('a.src')!.textContent!.trim(),
          translations: Array.from(groupEl.querySelectorAll('a.translation')).map((tr) => tr.textContent!.trim()),
        })),
        examples: parseExamples(reversoHtml),
      }
    case 'error':
      return {
        type: 'error',
      }
  }
}

export async function queryCharacterReverso(ch: string) {
  return fetch(`https://context.reverso.net/translation/chinese-english/${ch}`, { next: { revalidate: 60 * 60 * 24 * 7 } }).then((res) => res.text())
}

function parseExamples(el: Element): Example[] | null {
  let examplesHtml = el.querySelector('#examples-content')?.innerHTML
  if (!examplesHtml) return null
  const examplesDom = new JSDOM(examplesHtml).window.document.body
  Array.from(examplesDom.querySelectorAll('a')).map((a) => {
    const aInnerHtml = a.innerHTML
    a.outerHTML = aInnerHtml
  })
  const examplesElements = Array.from(examplesDom.querySelectorAll('.example'))
  return Array.from(examplesElements).map((ex) => ({
    original: ex.querySelector('.src')!.innerHTML,
    translation: ex.querySelector('.trg')!.innerHTML,
  }))
}
