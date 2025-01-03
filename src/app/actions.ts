'use server'

import { BkrsResponses, determineBkrsSearchType, parseBkrsPage } from '@/bkrs'
import { ReversoResponses, ReversoSearchMode, parseReverso } from '@/reverso'
import { JSDOM } from 'jsdom'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'
import path from 'path'

type Cookies = {
  'hide-welcoming-banner': true | undefined
}

async function _queryReverso(search: string, mode: ReversoSearchMode): Promise<ReversoResponses | undefined> {
  cookies() // disable cache
  const langPath = {
    'ch-en': 'chinese-english',
    'en-ch': 'english-chinese',
  } satisfies Record<ReversoSearchMode, string>
  try {
    const encodedSearch = encodeURI(search.trim())
    const _path = `/translation/${langPath[mode]}/${encodedSearch}`
    const referer = path.join(`https://context.reverso.net/`, _path)
    const h = {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-encoding': 'gzip, deflate, br, zstd',
      'accept-language': 'ru,en;q=0.9,es;q=0.8',
      'cache-control': 'max-age=0',
      priority: 'u=0, i',
      referer,
      'sec-ch-ua': '"Chromium";v="130", "YaBrowser";v="24.12", "Not?A_Brand";v="99", "Yowser";v="2.5"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'Same-Origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 YaBrowser/24.12.0.0 Safari/537.36',
    }
    const headers = new Headers()
    Object.entries(h).forEach(([k, v]) => {
      headers.append(k, v)
    })
    const reversoHtml = await fetch(`https://context.reverso.net/translation/${langPath[mode]}/${encodedSearch}`, {
      next: { revalidate: 60 * 60 * 24 * 30 },
      method: 'GET',
      referrerPolicy: 'strict-origin-when-cross-origin',
      referrer: referer,
      headers,
    }).then((res) => res.text())
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
    // temporaily replace links so they don't get detected for word selection later
    ;['.ch_ru', '.ru'].forEach((elClass) => {
      const el = bodyEl.querySelector(`.margin_left > ${elClass}`)
      if (el) {
        el.querySelectorAll('a').forEach((el, i) => {
          el.replaceWith(`{{link:${i}|${el.textContent ?? ''}}}`)
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

export async function getCookie<N extends keyof Cookies>(name: N) {
  const value = cookies().get(name)?.value
  if (!value) return
  return JSON.parse(value) as Cookies[N]
}

export async function setCookie<N extends keyof Cookies>(name: N, value: NonNullable<Cookies[N]>, options?: Partial<ResponseCookie>) {
  cookies().set(name, JSON.stringify(value), { maxAge: 60 * 60 * 24 * 365, ...options })
}

export async function hasCookie<N extends keyof Cookies>(name: N) {
  return !!cookies().get(name)?.value
}

export async function deleteCookie<N extends keyof Cookies>(name: N) {
  return !!cookies().delete(name)
}
