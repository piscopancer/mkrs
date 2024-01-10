import { TNextPage } from '@/utils'
import { Cheerio, Element } from 'cheerio'
import { domToReact, htmlToDOM } from 'html-react-parser'
import React, { HTMLAttributes, ReactNode } from 'react'

export type TSearchPage = TNextPage<'slug'>

export function stringToReact(str: string) {
  return domToReact(htmlToDOM(str))
}

// const nodesClasses = ['em', 'ex', 'm2', 'm3'] as const

// type TNode = {
//   text: string
//   class: (typeof nodesClasses)[number] | undefined
//   children: TNode[]
// }

// export function getNodes($: Cheerio<Element>): TNode[] {
//   return $.children()
//     .map((i, el) => {
//       const child = $.children().eq(i)
//       return {
//         class: el.attribs['class'] as TNode['class'],
//         text: child.text(),
//         children: getNodes(child),
//       } as TNode
//     })
//     .toArray()
// }

// export function renderNodes(nodes: TNode[]): ReactNode[] {
//   return nodes.map((node, i) => {
//     let children: ReactNode[] = []
//     if (node.children && node.children.length > 0) {
//       children = renderNodes(node.children)
//     }

//     return (
//       <div key={i} className={node.class}>
//         {children}
//         {node.text}
//       </div>
//     )
//   })
// }
