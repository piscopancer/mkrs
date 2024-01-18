import { parse, queryCharacter, determineSearchType, TSearchType, TSearchProps } from '@/search'
import { JSDOM } from 'jsdom'
import { ReactNode } from 'react'
import { TSearchPage } from './(private)'
import KeyActions from './(private)/key-actions'
import Ch from './(private)/(searches)/ch'
import Ru from './(private)/(searches)/ru'
import Py from './(private)/(searches)/py'
import SearchError from './(private)/(searches)/search-error'

export default async function SearchPage({ params }: TSearchPage) {
  const resText = await queryCharacter(params.slug)
  if (!resText) return

  const el = new JSDOM(resText).window.document.body

  el.querySelectorAll('a').forEach((el) => {
    el.setAttribute('href', `/search/${el.textContent}`)
  })

  const parsedSearch = parse(el, determineSearchType(el))

  const searches = {
    ch: Ch,
    ru: Ru,
    py: Py,
    error: SearchError,
  } satisfies { [T in TSearchType]: (props: TSearchProps<T>) => ReactNode }

  function Search<T extends TSearchType>(props: TSearchProps<T>) {
    return searches[parsedSearch.type](props as never)
  }

  return (
    <>
      <Search search={parsedSearch} />
      <KeyActions />
    </>
  )
}
