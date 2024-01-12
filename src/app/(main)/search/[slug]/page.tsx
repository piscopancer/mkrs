import '@/assets/styles/search.scss'
import { TResult, TResultProps, determineSearchResult, queryCharacter } from '@/search'
import { JSDOM } from 'jsdom'
import { ReactNode } from 'react'
import { TSearchPage } from './(private)'
import ChWord from './(private)/(results)/ch-word'
import PinyinNotFound from './(private)/(results)/pinyin-not-found'
import RuWord from './(private)/(results)/ru-word'
import SearchError from './(private)/(results)/search-error'
import SuggestFromPinyin from './(private)/(results)/suggest-from-pinyin'
import SuggestFromRu from './(private)/(results)/suggest-from-ru'
import Words from './(private)/(results)/words'
import KeyActions from './(private)/key-actions'

export default async function SearchPage({ params }: TSearchPage) {
  const resText = await queryCharacter(params.slug)
  if (!resText) return

  const d = new JSDOM(resText).window.document.body

  d.querySelectorAll('a').forEach((el) => {
    el.setAttribute('href', `/search/${el.textContent}`)
  })

  const result = determineSearchResult(d)

  const Result = (
    {
      'ch-word': ChWord,
      'ru-word': RuWord,
      'suggest-from-pinyin': SuggestFromPinyin,
      'pinyin-not-found': PinyinNotFound,
      'suggest-from-ru': SuggestFromRu,
      words: Words,
      error: SearchError,
    } satisfies Record<TResult, (props: TResultProps) => ReactNode>
  )[result]

  return (
    <>
      <Result el={d} />
      <KeyActions />
    </>
  )
}
