import WordSelector from '@/components/word-selector'
import { DOMNode, domToReact, Element, HTMLReactParserOptions } from 'html-react-parser'
import { Route } from 'next'
import Link from 'next/link'

export const replaceButtonsWithWordsSelectors: HTMLReactParserOptions['replace'] = (domNode) => {
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
}
