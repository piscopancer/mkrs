import Logo from '@/assets/logo.png'
import { project } from '@/project'
import { TSearchProps, TSearchType, determineSearchType, parse, queryCharacter } from '@/search'
import { JSDOM } from 'jsdom'
import { Metadata } from 'next'
import { ReactNode } from 'react'
import Ch from './(private)/(searches)/ch'
import ChLong from './(private)/(searches)/ch-long'
import Py from './(private)/(searches)/py'
import Ru from './(private)/(searches)/ru'
import SearchError from './(private)/(searches)/search-error'
import { TSearchPage } from './(private)/util'

export async function generateMetadata({ params }: TSearchPage): Promise<Metadata> {
  const slug = decodeURI(params.slug)
  const title = `${slug} — ${project.name}`
  const description = `Смотрите перевод "${slug}" на МКРС`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: Logo.src }],
    },
  }
}

export default async function SearchPage({ params }: TSearchPage) {
  const resText = await queryCharacter(params.slug)
  if (!resText) return
  const el = new JSDOM(resText).window.document.body
  el.querySelectorAll('a').forEach((el) => {
    el.setAttribute('href', `/search/${el.textContent}`)
  })
  const parsedSearch = parse(el, determineSearchType(el))

  return <Search search={parsedSearch} />
}

const searches = {
  ch: Ch,
  ru: Ru,
  py: Py,
  'ch-long': ChLong,
  error: SearchError,
} satisfies { [T in TSearchType]: (props: TSearchProps<T>) => ReactNode }

function Search<T extends TSearchType>(props: TSearchProps<T>) {
  return searches[props.search.type](props as never)
}
