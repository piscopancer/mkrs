'use client'

import { stringToReact } from '@/utils'
import clsx from 'clsx'
import { DOMNode, domToReact, Element } from 'html-react-parser'
import { Route } from 'next'
import Link from 'next/link'
import { ComponentProps } from 'react'

const chineseCharactersStringMatcher = /(\p{Script=Han}+)/gmu

function splitChinese(chinese: string) {
  const segmenter = new Intl.Segmenter([], { granularity: 'word' })
  const segmentedText = segmenter.segment(chinese)
  const words = [...segmentedText].filter((s) => s.isWordLike).map((s) => s.segment)
  return words
}

export default function Tr({ tr, ...props }: ComponentProps<'div'> & { tr: string }) {
  let modTr = tr

  // const extractedChinese = modTr.match(chineseCharactersStringMatcher)
  // const extractedChineseWords = extractedChinese?.map(splitChinese).flat() ?? []

  // for (let i = 0; i < extractedChineseWords.length; i++) {
  //   const chWord = extractedChineseWords[i]

  //   // find all matches for word, if already modified - skip, if untouched - go

  //   const matches = new RegExp(chWord).exec(modTr)

  //   const startIndex = matches!.index
  //   const endIndex = matches![0].length
  //   console.log()

  //   matches!.forEach((match, i) => {
  //     modTr.indexOf(match)
  //   })

  //   for (let index = 0; index < array.length; index++) {
  //     const element = array[index];

  //   }

  // modTr = modTr.replace(new RegExp(`(?<!\\[{\\d,}\\|)(${chWord})(?!\\])`), `[${i}|${chWord}]`)
  // const rx = new RegExp(`(.*)(${chWord})(.*)`)
  // const matches = modTr.match(rx)
  // console.log('0', matches?.groups)
  // do {
  //   const matches = modTr.match(rx)
  //   matches?.groups
  // } while ();

  // modTr = modTr.replace(rx, (substr) => {
  // console.log(substr)
  // rx.
  // `[${i}|${chWord}]
  // return substr
  // })
  // }

  const modChineseWordsMatcher = /\[\d+\|(\p{Script=Han}+)\]/gu
  // modTr = modTr.replace(modChineseWordsMatcher, `<a href="/search/$1">$1</a>`)

  return (
    <>
      {/* <pre className='mb-4 text-wrap text-xs text-zinc-500'>{JSON.stringify(extractedChinese)}</pre> */}
      {/* <pre className='mb-4 text-wrap text-xs text-zinc-500'>{JSON.stringify(extractedChineseWords)}</pre> */}
      {/* <pre className='mb-4 text-xs text-zinc-500'>{tr}</pre> */}
      <div {...props} data-search className={clsx('text-xl max-md:text-base', props.className)}>
        {stringToReact(modTr, {
          replace: (domNode) => {
            if (domNode instanceof Element && domNode.tagName === 'a') {
              return (
                <Link prefetch={false} href={(domNode.attribs as { href: Route }).href}>
                  {domToReact(domNode.children as DOMNode[])}
                </Link>
              )
            }
          },
        })}
      </div>
    </>
  )
}
