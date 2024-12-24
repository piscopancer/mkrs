import { queryBkrs } from '@/app/actions'
import Reverso from '@/components/reverso'
import { stringToReact } from '@/utils'
import { DOMNode, domToReact, Element } from 'html-react-parser'
import { Route } from 'next'
import Link from 'next/link'

const chineseCharactersStringMatcher = /(\p{Script=Han}+)/gmu

function split(chinese: string) {
  const segmenter = new Intl.Segmenter([], { granularity: 'word' })
  const segmentedText = segmenter.segment(chinese)
  const words = [...segmentedText].filter((s) => s.isWordLike).map((s) => s.segment)
  return words
}

export default async function TestPage() {
  const res = await queryBkrs('看得') // 便
  if (!res) return 'bruh'
  if (res.type !== 'ch') {
    return 'not ch :('
  }
  if (!res.tr) return 'no tr :('

  let modTr = res.tr

  const extractedChinese = modTr.match(chineseCharactersStringMatcher)
  const extractedChineseWords = extractedChinese?.map(split) ?? []
  const extractedChineseWordsFlat = extractedChineseWords.flat()

  for (let i = 0; i < extractedChineseWordsFlat.length; i++) {
    const chWord = extractedChineseWordsFlat[i]
    modTr = modTr.replace(new RegExp(`(?<!\\[{\\d,}\\|)(${chWord})(?!\\])`), `[${i}|${chWord}]`)
  }

  const modChineseWordsMatcher = /\[\d+\|(\p{Script=Han}+)\]/gu
  modTr = modTr.replace(modChineseWordsMatcher, `<a href="/search/$1">$1</a>`)

  return (
    <div className='mx-auto mt-24 max-w-screen-md'>
      <section className='mb-12'>
        {stringToReact(modTr, {
          replace: (domNode) => {
            if (domNode instanceof Element && domNode.tagName === 'a') {
              console.log(domNode.children[0].data)
              return (
                <Link className='inline-block border-b-2 border-zinc-800 px-0.5 py-0.5 hover:border-zinc-700 hover:bg-zinc-800' prefetch={false} href={(domNode.attribs as { href: Route }).href}>
                  {domToReact(domNode.children as DOMNode[])}
                </Link>
              )
            }
          },
        })}
      </section>
      <Reverso mode='ch-en' search='看得' />
    </div>
  )
}
