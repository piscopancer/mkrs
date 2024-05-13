import * as Article from '@/components/article'
import clsx from 'clsx'
import _Markdown from 'markdown-to-jsx'
import { Children, ComponentProps } from 'react'

export default function MarkdownArticle(props: ComponentProps<'article'>) {
  return (
    <article {...props} className={clsx(props.className)}>
      {Children.map(props.children, (child) => {
        if (typeof child === 'string')
          return (
            <_Markdown
              options={{
                overrides: { ...Article },
              }}
            >
              {child}
            </_Markdown>
          )
        return child
      })}
    </article>
  )
}
