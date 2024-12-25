'use client'

import { searchStore, tools as searchTools } from '@/search'
import { objectEntries, type TComponent } from '@/utils'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import Scanner from './scanner'

export default function Tools({ props, ...attr }: TComponent<'article', {}>) {
  const toolSnap = searchStore.tool.use()
  const showToolsSnap = searchStore.showTools.use()

  return (
    <article {...attr} className={clsx(attr.className, 'max-md:hidden')}>
      <menu className='flex'>
        {objectEntries(searchTools).map(([tool, toolInfo]) => (
          <li key={tool} className='group'>
            <button
              onClick={() => {
                if (tool === searchStore.tool.get()) {
                  searchStore.showTools.set(false)
                } else {
                  searchStore.tool.set(tool)
                }
              }}
              className={clsx(
                'flex items-center gap-2 border-t-2 border-zinc-800 px-3 py-2 text-sm leading-none disabled:opacity-50 group-first:rounded-tl-xl group-first:border-l-2 group-last:rounded-tr-xl group-last:border-r-2',
                toolSnap === tool ? 'bg-zinc-800 text-zinc-300 hover:text-zinc-400' : 'text-zinc-500 enabled:hover:bg-zinc-800/50',
              )}
            >
              <toolInfo.icon className='' />
              <h1>{toolInfo.name}</h1>
            </button>
          </li>
        ))}
      </menu>
      <Tool props={{ tool: toolSnap }} />
    </article>
  )
}

const toolsMap = {
  scanner: Scanner,
} satisfies Record<keyof typeof searchTools, (comp: TComponent<any, any>) => ReactNode>

function Tool({ props, ...attr }: TComponent<'article', { tool: keyof typeof searchTools }>) {
  return <>{objectEntries(toolsMap).map(([tool, Tool]) => props.tool === tool && <Tool key={tool} props={{}} {...attr} />)}</>
}
