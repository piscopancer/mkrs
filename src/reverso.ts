export type ReversoResponseType = 'one' | 'many' | 'error'
import { JSDOM } from 'jsdom'

export type ReversoSearchMode = 'en-ch' | 'ch-en'

type ReversoResponseBase<T extends ReversoResponseType, O extends object> = { type: T } & O
export type Example = { original: string; translation: string }

export type ReversoResponses =
  | (ReversoResponseBase<
      'one',
      {
        translations: string[]
      }
    > & { examples: Example[] | null })
  | (ReversoResponseBase<
      'many',
      {
        translations: string[] | null
        groups: { original: string; translations: string[] }[]
      }
    > & { examples: Example[] | null })
  | ReversoResponseBase<'error', {}>

export type ReversoResponse<T extends ReversoResponseType> = ReversoResponses & { type: T }

export type ReversoResponseProps<T extends ReversoResponseType> = { response: ReversoResponse<T> }

function determineSearchType(el: Element): ReversoResponseType {
  if (el.querySelector('#translations-content') && !el.querySelector('#splitting-content')) return 'one'
  if (el.querySelector('#splitting-content')) return 'many'
  return 'error'
}

export function parseReverso(reversoHtml: Element): ReversoResponses {
  const type = determineSearchType(reversoHtml)
  switch (type) {
    case 'one':
      return {
        type: 'one',
        translations: Array.from(reversoHtml.querySelector('#translations-content')!.querySelectorAll('.translation')).map((tr) => tr.textContent!.trim()),
        examples: parseExamples(reversoHtml),
      }
    case 'many':
      const translationsEl = reversoHtml.querySelector('#translations-content')
      return {
        type: 'many',
        translations: translationsEl ? Array.from(translationsEl.querySelectorAll('.translation')).map((tr) => tr.textContent!.trim()) : null,
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
