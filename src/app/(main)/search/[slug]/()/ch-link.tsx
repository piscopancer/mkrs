'use client'

import { queryBkrs } from '@/app/actions'
import { modifyTr } from '@/bkrs'
import { Tooltip } from '@/components/tooltip'
import { queryKeys } from '@/query'
import { stringToReact } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import Link from 'next/link'
import { useRef, useState } from 'react'

export default function ChLink({ search, ...attrs }: React.ComponentProps<'a'> & { search: string }) {
  const [queryEnabled, setQueryEnabled] = useState(false)
  const { data: translationQuery } = useQuery({
    enabled: queryEnabled,
    queryKey: queryKeys.bkrs(search),
    queryFn() {
      return queryBkrs(search)
    },
    select(res) {
      if (res?.type === 'ch') {
        return {
          py: res.py !== '_' ? res.py : null,
          ru: res.tr ? modifyTr(res.tr) : null,
        }
      } else return null
    },
  })
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const timer = useRef<NodeJS.Timeout>()

  return (
    <Tooltip
      open={tooltipOpen && !!translationQuery}
      onOpenChange={setTooltipOpen}
      content={
        translationQuery && (
          <>
            {translationQuery.py && <p className='mb-0.5 font-mono text-zinc-400'>{translationQuery.py}</p>}
            {translationQuery.ru && <div className='line-clamp-5'>{stringToReact(translationQuery.ru)}</div>}
          </>
        )
      }
      className='max-w-[40ch]'
    >
      <Link
        {...attrs}
        onPointerEnter={() => {
          if (!timer.current && !translationQuery) {
            timer.current = setTimeout(() => {
              setQueryEnabled(true)
            }, 500)
          }
        }}
        onPointerLeave={() => {
          if (timer.current) {
            clearTimeout(timer.current)
            timer.current = undefined
          }
        }}
        href={`/search/${search}`}
        className={clsx(attrs.className, 'text-lg max-md:text-sm')}
      >
        {search}
      </Link>
    </Tooltip>
  )
}
