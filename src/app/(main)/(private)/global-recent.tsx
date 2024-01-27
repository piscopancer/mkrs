'use client'

import { classes, wait } from '@/utils'
import Link from 'next/link'
import { ComponentProps, useEffect, useState } from 'react'
import { TGlobalRecent } from './util'

export default function GlobalRecent({ recent: _recent, ...htmlProps }: ComponentProps<'div'> & { recent: TGlobalRecent[] }) {
  const [recent, setRecent] = useState(_recent)
  const refereshTime = 3

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    await wait(refereshTime)
    queryGlobalRecent().then(setRecent)
    refresh()
  }

  async function queryGlobalRecent(): Promise<TGlobalRecent[]> {
    const url = new URL(process.env.NEXT_PUBLIC_URL)
    url.pathname = '/api/recent'
    const text = await fetch(url).then((res) => res.text())
    const el = new DOMParser().parseFromString(text, 'text/html').documentElement
    const recentSearches = Array.from(el.querySelectorAll('#last_search_table .ls_item')).map(
      (el) =>
        ({
          search: el.textContent ?? '-',
          found: el.querySelector('a.not_found') ? true : undefined,
        } satisfies TGlobalRecent)
    )
    return recentSearches
  }

  return (
    <section {...htmlProps} className={classes(htmlProps.className, '')}>
      <ul>
        {recent.map((r, i) => (
          <li key={i}>
            <Link href={`/search/${r.search}`} className={classes(r.found ? 'text-zinc-200' : 'to-zinc-500', 'block')}>
              {r.search}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
