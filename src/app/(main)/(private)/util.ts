// import { JSDOM } from 'jsdom'

// export type TGlobalRecent = {
//   search: string
//   found?: true
// }

// export async function queryGlobalRecent(): Promise<TGlobalRecent[]> {
//   const url = new URL(process.env.NEXT_PUBLIC_URL)
//   url.pathname = '/api/recent'
//   const text = await fetch(url).then((res) => res.text())
//   const el = new JSDOM(text).window.document.documentElement
//   const recentSearches = Array.from(el.querySelectorAll('#last_search_table .ls_item')).map(
//     (el) =>
//       ({
//         search: el.textContent ?? '-',
//         found: el.querySelector('a.not_found') ? true : undefined,
//       } satisfies TGlobalRecent)
//   )
//   return recentSearches
// }
