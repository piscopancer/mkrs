'use server'

import { BkrsResponses, determineBkrsSearchType, parseBkrsPage } from '@/bkrs'
import { ReversoResponses, ReversoSearchMode, parseReverso } from '@/reverso'
import { JSDOM } from 'jsdom'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'

type TCookies = {
  'hide-welcoming-banner': true | undefined
}

async function _queryReverso(search: string, mode: ReversoSearchMode): Promise<ReversoResponses | undefined> {
  const langPath = {
    'ch-en': 'chinese-english',
    'en-ch': 'english-chinese',
  } satisfies Record<ReversoSearchMode, string>
  try {
    const reversoHtml = await fetch(`https://context.reverso.net/translation/${langPath[mode]}/${search}`, { next: { revalidate: 60 * 60 * 24 * 7 } }).then((res) => res.text())

    const bodyEl = new JSDOM(reversoHtml).window.document.body
    const res = parseReverso(bodyEl)
    return res
  } catch (error) {
    console.error('Reverso error', error)
    return undefined
  }
}

export async function queryReverso(search: string, mode: ReversoSearchMode) {
  return _queryReverso.bind(null, search, mode)()
}

async function _queryBkrs(search: string): Promise<BkrsResponses | undefined> {
  try {
    const html = await fetch(`https://bkrs.info/slovo.php?ch=${search}`).then((res) => res.text())
    const bodyEl = new JSDOM(html).window.document.body
    ;['.ch_ru', '.ru'].forEach((elClass) => {
      const el = bodyEl.querySelector(`.margin_left > ${elClass}`)
      if (el) {
        el.querySelectorAll('a').forEach((el) => {
          const span = new JSDOM(html).window.document.createElement('span')
          span.innerHTML = el.innerHTML
          span.setAttribute('href', el.textContent ?? '/')
          el.replaceWith(span)
        })
      }
    })

    bodyEl.querySelectorAll('img').forEach((i) => i.remove())
    const res = parseBkrsPage(bodyEl, determineBkrsSearchType(bodyEl))
    bodyEl.remove()
    return res
  } catch (error) {
    console.error('Bkrs error', error)
    return undefined
  }
}

export async function queryBkrs(search: string) {
  return _queryBkrs.bind(null, search)()
}

export async function getCookie<N extends keyof TCookies>(name: N) {
  const value = cookies().get(name)?.value
  if (!value) return
  return JSON.parse(value) as TCookies[N]
}

export async function setCookie<N extends keyof TCookies>(name: N, value: NonNullable<TCookies[N]>, options?: Partial<ResponseCookie>) {
  cookies().set(name, JSON.stringify(value), { maxAge: 60 * 60 * 24 * 365, ...options })
}

export async function hasCookie<N extends keyof TCookies>(name: N) {
  return !!cookies().get(name)?.value
}

export async function deleteCookie<N extends keyof TCookies>(name: N) {
  return !!cookies().delete(name)
}
