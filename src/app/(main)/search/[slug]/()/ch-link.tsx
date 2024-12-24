'use client'

import { queryBkrs } from '@/app/actions'
import { Tooltip } from '@/components/tooltip'
import { stringToReact } from '@/utils'
import clsx from 'clsx'
import Link from 'next/link'
import { useRef, useState } from 'react'

export default function ChLink({ search, ...attrs }: React.ComponentProps<'a'> & { search: string }) {
  const [translation, setTranslation] = useState<null | { py: string | undefined; ru: string | undefined }>()
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const timer = useRef<NodeJS.Timeout>()

  return (
    <Tooltip
      open={tooltipOpen && !!translation}
      onOpenChange={setTooltipOpen}
      content={
        translation && (
          <>
            {translation.py && <p className='mb-0.5 font-mono text-zinc-400'>{translation.py}</p>}
            {translation.ru && <div className='line-clamp-5'>{stringToReact(translation.ru)}</div>}
          </>
        )
      }
      className='max-w-[40ch]'
    >
      <Link
        {...attrs}
        prefetch={false}
        onPointerEnter={() => {
          if (!timer.current && !translation) {
            timer.current = setTimeout(async () => {
              const res = await queryBkrs(search)
              if (res?.type === 'ch') {
                setTranslation({
                  py: res.py !== '_' ? res.py : undefined,
                  ru: res.tr,
                })
              }
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
