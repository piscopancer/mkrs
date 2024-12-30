import clsx from 'clsx'
import { ComponentProps } from 'react'
import { Tooltip } from './tooltip'

export function h1(props: ComponentProps<'h1'>) {
  return (
    <h1 id={props.children?.toString() ?? ''} className='my-10 border-b-2 border-zinc-800 pb-2 font-display text-2xl max-md:text-xl'>
      {props.children}
    </h1>
  )
}

export function h2(props: ComponentProps<'h2'>) {
  return (
    <h1 id={props.children?.toString() ?? ''} className='mb-2 mt-8 font-display text-xl text-zinc-300 max-md:text-lg'>
      {props.children}
    </h1>
  )
}

export function a(props: ComponentProps<'a'>) {
  return (
    <Tooltip content={decodeURI(props.href ?? '')}>
      <a target={props.href?.startsWith('#') ? '_self' : '_blank'} href={props.href} className='border-b border-pink-500/20 text-pink-500 duration-100 max-md:active:border-pink-500/80 max-md:active:text-pink-400 md:hover:border-pink-500/80 md:hover:text-pink-400'>
        {props.children}
      </a>
    </Tooltip>
  )
}

export function p(props: ComponentProps<'p'>) {
  return <p className='my-4 text-lg text-zinc-400 max-md:text-base'>{props.children}</p>
}

export function kbd(props: ComponentProps<'kbd'>) {
  return (
    <kbd className={clsx(props.className, 'mx-1 inline-block w-fit origin-bottom -translate-y-px cursor-pointer select-none rounded-md bg-zinc-800/50 px-2 text-base text-zinc-300 shadow-key duration-200 active:translate-y-[2px] active:scale-y-95 active:text-zinc-500 max-md:text-sm')}>
      {props.children}
    </kbd>
  )
}

export function strong(props: ComponentProps<'strong'>) {
  return <strong className='text-zinc-300'>{props.children}</strong>
}

export function code(props: ComponentProps<'code'>) {
  return <code className='rounded-sm bg-zinc-700 px-[0.5ch] font-mono text-base text-zinc-200 max-md:text-sm'>{props.children}</code>
}

export function ul(props: ComponentProps<'ul'>) {
  return <ul className='list-inside list-disc marker:text-zinc-700'>{props.children}</ul>
}

export function li(props: ComponentProps<'li'>) {
  return <li className='text-lg text-zinc-400 max-md:text-base'>{props.children}</li>
}
