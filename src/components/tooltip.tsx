'use client'

import * as RTooltip from '@radix-ui/react-tooltip'

type TTooltip = {
  children?: React.ReactNode
  content: React.ReactNode
  arrow?: boolean
  delay?: number
  open?: boolean
} & Omit<RTooltip.TooltipContentProps, 'content'>

export function Tooltip({ children, content, arrow, delay, open, ...htmlProps }: TTooltip) {
  return (
    <RTooltip.Provider delayDuration={delay || 100} disableHoverableContent>
      <RTooltip.Root open={open}>
        <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
        <RTooltip.Content {...htmlProps} className='z-[2] rounded-lg border-2 border-stone-700 bg-stone-800 px-3 py-1 text-sm text-stone-200'>
          {content}
          {(arrow === undefined || arrow) && <RTooltip.Arrow className='fill-stone-700' />}
        </RTooltip.Content>
      </RTooltip.Root>
    </RTooltip.Provider>
  )
}
