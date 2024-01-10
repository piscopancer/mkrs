import { TSearchPage, stringToReact } from '.'
import '@/assets/styles/search.scss'
import Backlinks from './backlinks'
import { JSDOM } from 'jsdom'
import RuchFulltext from './ruch-fulltext'
import KeyActions from './key-actions'

export default async function SearchPage({ params }: TSearchPage) {
  const res = await fetch(`https://bkrs.info/slovo.php?ch=${params.slug}`)
  const text = await res.text()
  const doc = new JSDOM(text).window.document
  const d = doc.querySelector('#ajax_search .margin_left')
  if (!d) return

  d.querySelectorAll('a').forEach((el) => {
    el.setAttribute('href', `/search/${el.textContent ?? data.character}`)
    console.log('A', el)
  })

  const untouched = {
    translations: d.querySelector('.ru')?.innerHTML,
  }

  const backlinks = d.querySelector('#backlinks')
  const ruchFulltext = d.querySelector('#ruch_fulltext')

  const data = {
    character: d.querySelector('#ch')?.textContent ?? '',
    pinyin: d.querySelector('.py')?.textContent ?? '',
    ruchFulltext:
      ruchFulltext &&
      Array.from(ruchFulltext.querySelectorAll('#ruch_fulltext > *')).map((ch) => ({
        heading: ch.children[0].textContent,
        content: ch.children[1].outerHTML,
      })),
    backlinks: backlinks && Array.from(backlinks.querySelectorAll('a')).map((a) => a.textContent!),
  }

  return (
    <>
      <main id='ch-page'>
        <h1 className='text-4xl mb-2 text-zinc-200'>{data.character}</h1>
        <h2 className='text-xl mb-6 text-zinc-300 italic'>{data.pinyin}</h2>
        {untouched.translations && <ul className='mb-12'>{stringToReact(untouched.translations)}</ul>}
        {data.ruchFulltext && <RuchFulltext pairs={data.ruchFulltext} className='mb-12' />}
        {data.backlinks && <Backlinks links={data.backlinks} />}
      </main>
      <KeyActions />
    </>
  )
}
