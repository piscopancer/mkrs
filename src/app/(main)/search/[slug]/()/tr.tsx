'use client'

import { stringToReact } from '@/utils'
import clsx from 'clsx'
import { DOMNode, domToReact, Element } from 'html-react-parser'
import { Route } from 'next'
import Link from 'next/link'
import { ComponentProps } from 'react'
import WordSelector from './word-selector'

const chineseCharactersStringMatcher = /(\p{Script=Han}+)/gmu

function changeChineseToAnchors(chinese: string) {
  const matches = chinese.match(chineseCharactersStringMatcher)
  if (!matches) {
    return chinese
  }
  // split
  const segmenter = new Intl.Segmenter([], { granularity: 'word' })
  const segments = matches.map((match) => segmenter.segment(match))
  const splitMatches = segments.map((segment) => [...segment].filter((s) => s.isWordLike).map((s) => s.segment)).flat()
  // modify by index
  let modified = chinese
  // search and cross out
  let dirtyStr = chinese
  for (let i = 0; i < splitMatches.length; i++) {
    const match = splitMatches[i]
    const startIndex = dirtyStr.search(match)
    modified = [...modified].toSpliced(startIndex, match.length, `{{${i}|${match}}}`).join('')
    dirtyStr = [...dirtyStr].toSpliced(startIndex, match.length, `{{${'.'.repeat(String(i).length + 1 + match.length)}}}`).join('')
  }
  modified = modified.replace(/{{(\d+)\|(.*?)}}/g, `<button data-select-id="$1" data-select-value="$2">$2</button>`)
  return modified
}

export default function Tr({ tr, ...props }: ComponentProps<'div'> & { tr: string }) {
  let modTr = changeChineseToAnchors(tr)

  // TODO: prequery all words from modTr for their info to be quickly shown

  return (
    <>
      <div {...props} data-search className={clsx('text-xl max-md:text-base', props.className)}>
        {stringToReact(modTr, {
          replace: (domNode) => {
            if (domNode instanceof Element) {
              if ('href' in domNode.attribs) {
                return (
                  <Link prefetch={false} href={(domNode.attribs as { href: Route }).href}>
                    {domToReact(domNode.children as DOMNode[])}
                  </Link>
                )
              }
              if ('data-select-id' in domNode.attribs) {
                const wordId = Number(domNode.attribs['data-select-id'])
                const word = domNode.attribs['data-select-value']
                return (
                  <WordSelector word={word} wordId={wordId}>
                    {domToReact(domNode.children as DOMNode[])}
                  </WordSelector>
                )
              }
            }
          },
        })}
      </div>
    </>
  )
}
