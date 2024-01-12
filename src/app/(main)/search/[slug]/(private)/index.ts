import useKey from '@/hooks/use-key'
import { TNextPage } from '@/utils'
import { domToReact, htmlToDOM } from 'html-react-parser'
import { useRouter } from 'next/navigation'

export type TSearchPage = TNextPage<'slug'>

export function stringToReact(str: string) {
  return domToReact(htmlToDOM(str))
}
