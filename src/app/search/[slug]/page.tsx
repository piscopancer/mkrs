import '@/assets/styles/search.scss'
import { JSDOM } from 'jsdom'
import { TResultProps, TSearchPage, stringToReact } from './(private)'
import KeyActions from './(private)/key-actions'
import RuchFulltext from './(private)/ruch-fulltext'
import Search from '@/components/search'
import { TResult, determineSearchResult } from '@/search'
import { ReactNode } from 'react'
import Word from './(private)/(results)/word'
import Words from './(private)/(results)/words'
import SuggestFromPinyin from './(private)/(results)/suggest-from-pinyin'
import SuggestFromRu from './(private)/(results)/suggest-from-ru'
import PinyinNotFound from './(private)/(results)/pinyin-not-found'
import SearchError from './(private)/(results)/search-error'

export default async function SearchPage({ params }: TSearchPage) {
  const res = await fetch(`https://bkrs.info/slovo.php?ch=${params.slug}`)
  const text = await res.text()
  const doc = new JSDOM(text).window.document
  const d = doc.querySelector('#ajax_search .margin_left')
  if (!d) return

  const result = determineSearchResult(d)

  const Result = (
    {
      word: Word,
      words: Words,
      'suggest-from-pinyin': SuggestFromPinyin,
      'pinyin-not-found': PinyinNotFound,
      'suggest-from-ru': SuggestFromRu,
      error: SearchError,
    } satisfies Record<TResult, (props: TResultProps) => ReactNode>
  )[result]

  return (
    <>
      <Search />
      <Result d={d} />
      <KeyActions />
    </>
  )
}
