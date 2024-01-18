import { TNextPage } from '@/utils'
import { domToReact, htmlToDOM } from 'html-react-parser'

export type TSearchPage = TNextPage<'slug'>

export function stringToReact(str: string) {
  return domToReact(htmlToDOM(str))
}
