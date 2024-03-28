import type { MDXComponents } from 'mdx/types'
import { Tooltip } from './components/tooltip'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children }) => (
      <h1 id={children?.toString() ?? ''} className='my-10 border-b-2 border-zinc-800 pb-2 font-display text-2xl max-md:text-xl'>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h1 id={children?.toString() ?? ''} className='my-6 font-display text-xl text-zinc-300 max-md:text-lg'>
        {children}
      </h1>
    ),
    a: ({ children, href }) => (
      <Tooltip content={decodeURI(href ?? '')}>
        <a target={href?.startsWith('#') ? '_self' : '_blank'} href={href} className='border-b border-pink-500/20 text-pink-500 duration-100 max-md:active:border-pink-500/80 max-md:active:text-pink-400 md:hover:border-pink-500/80 md:hover:text-pink-400'>
          {children}
        </a>
      </Tooltip>
    ),
    p: ({ children }) => <p className='my-4 text-lg text-zinc-400 max-md:text-base'>{children}</p>,
    strong: ({ children }) => <strong className='text-zinc-300'>{children}</strong>,
    code: ({ children }) => <code className='rounded-lg bg-zinc-800 px-2 font-mono'>{children}</code>,
    ul: ({ children }) => <ul className='list-inside list-disc marker:text-zinc-700'>{children}</ul>,
    li: ({ children }) => <li className='text-lg text-zinc-400 max-md:text-base'>{children}</li>,
    blockquote: ({ children }) => <blockquote className='m-0 flex flex-col gap-4 rounded-lg border-l-4 border-zinc-700 bg-gradient-to-r from-zinc-800 to-transparent px-4 py-2 text-base [&_*]:m-0 [&_*]:text-base'>{children}</blockquote>,
  }
}
