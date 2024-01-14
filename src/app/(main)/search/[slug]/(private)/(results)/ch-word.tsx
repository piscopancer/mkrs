import Link from 'next/link'
import { TbLink } from 'react-icons/tb'
import { stringToReact } from '..'
import RuchFulltext from '../ruch-fulltext'
import { TResultProps } from '@/search'

export default function ChWord({ el: d }: TResultProps) {
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
      Array.from(ruchFulltext.querySelectorAll('#ruch_fulltext > *')).map((ch) => {
        if (Array.from(ch.children).length) {
          return {
            heading: ch.children[0]?.textContent,
            content: ch.children[1]?.outerHTML,
          }
        }
        return { heading: null, content: null }
      }),
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
    </>
  )
}

function Backlinks(props: { links: string[] }) {
  return (
    <section className='relative p-4 rounded-md border-2 border-zinc-800 flex items-center gap-4'>
      <TbLink className='stroke-zinc-500 h-6 p-1 rounded-full bg-zinc-800 absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2' />
      <ul className='flex items-center gap-2'>
        {props.links.map((link) => (
          <Link key={link} href={`/search/${link}`} data-custom>
            {link}
          </Link>
        ))}
      </ul>
    </section>
  )
}
