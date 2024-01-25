import type { MDXComponents } from 'mdx/types'
import { Tooltip } from './components/tooltip'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: ({ children }) => (
      <h1 id={children?.toString() ?? ''} className='my-10 text-2xl font-display border-b-2 border-zinc-800 pb-2 max-md:text-xl'>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h1 id={children?.toString() ?? ''} className='my-6 text-xl font-display text-zinc-300 max-md:text-lg'>
        {children}
      </h1>
    ),
    a: ({ children, href }) => (
      <Tooltip content={decodeURI(href ?? '')}>
        <a target={href?.startsWith('#') ? '_self' : '_blank'} href={href} className='text-pink-500 hover:text-pink-300 duration-100'>
          {children}
        </a>
      </Tooltip>
    ),
    p: ({ children }) => <p className='my-4 text-zinc-400 text-lg max-md:text-base'>{children}</p>,
    strong: ({ children }) => <strong className='text-zinc-300'>{children}</strong>,
    code: ({ children }) => <code className='rounded-lg bg-zinc-800 px-2 font-mono'>{children}</code>,
    ul: ({ children }) => <ul className='list-disc list-inside marker:text-zinc-700'>{children}</ul>,
    li: ({ children }) => <li className='text-lg text-zinc-400 max-md:text-base'>{children}</li>,
    blockquote: ({ children }) => <blockquote className='border-l-4 border-zinc-700 px-4 py-2 gap-4 flex flex-col rounded-lg bg-gradient-to-r from-zinc-800 to-transparent [&_*]:text-base [&_*]:m-0 text-base m-0'>{children}</blockquote>,
  }
}
