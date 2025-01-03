'use client'

import { lastWordSelectorStore, selectedWordsStore } from '@/stores/selected-words'
import { stringToReact } from '@/utils'
import clsx from 'clsx'
import { DOMNode, domToReact, Element } from 'html-react-parser'
import { Route } from 'next'
import Link from 'next/link'
import { ComponentProps, useEffect } from 'react'
import WordSelector from './word-selector'

const chineseMatcher = /(\p{Script=Han}+)/gmu

function modifyTr(chinese: string) {
  let modified = chinese
  // hide links
  const linksReplacements: string[] = []
  Array.from(modified.matchAll(/{{link:(\d+)\|(.*?)}}/g)).forEach((match) => {
    const [_, i, link] = match
    linksReplacements[Number(i)] = link
  })
  modified = modified.replace(/{{link:(\d+)\|(.*?)}}/g, '{{link:$1}}')
  // modify chinese to word selectors
  const chineseMatches = modified.match(chineseMatcher)
  if (chineseMatches) {
    // split
    const segmenter = new Intl.Segmenter([], { granularity: 'word' })
    const segments = chineseMatches.map((match) => segmenter.segment(match))
    const splitMatches = segments.map((segment) => [...segment].filter((s) => s.isWordLike).map((s) => s.segment)).flat()
    // search and cross out
    let dirtyStr = modified
    for (let i = 0; i < splitMatches.length; i++) {
      const match = splitMatches[i]
      const startIndex = dirtyStr.search(match)
      modified = [...modified].toSpliced(startIndex, match.length, `{{word-select:${i}|${match}}}`).join('')
      dirtyStr = [...dirtyStr].toSpliced(startIndex, match.length, `{{word-select:${'.'.repeat(String(i).length + 1 + match.length)}}}`).join('')
    }
    modified = modified.replace(/{{word-select:(\d+)\|(.*?)}}/g, `<button data-select-id="$1" data-select-value="$2">$2</button>`)
  }
  // reveal links
  linksReplacements.forEach((repl, i) => {
    modified = modified.replace(new RegExp(`{{link:${i}}}`, 'g'), `<a href="/search/${repl}">${repl}</a>`)
  })
  return modified
}

export default function Tr({ tr, ...props }: ComponentProps<'div'> & { tr: string }) {
  let modTr = modifyTr(tr)

  useEffect(() => {
    return () => {
      selectedWordsStore.clearWords()
      lastWordSelectorStore.ref.current.set(null)
    }
  }, [])

  return (
    <>
      <div {...props} data-search className={clsx('text-xl max-md:text-base', props.className)}>
        {stringToReact(modTr, {
          replace: (domNode) => {
            if (domNode instanceof Element) {
              if ('href' in domNode.attribs) {
                return <Link href={(domNode.attribs as { href: Route }).href}>{domToReact(domNode.children as DOMNode[])}</Link>
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
