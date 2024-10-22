'use client'

import * as RTooltip from '@radix-ui/react-tooltip'
import clsx from 'clsx'

type TTooltip = {
  children?: React.ReactNode
  content: React.ReactNode
  arrow?: boolean
  delay?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
} & Omit<RTooltip.TooltipContentProps, 'content'>

export function Tooltip({ children, content, arrow, delay, open, onOpenChange, ...htmlProps }: TTooltip) {
  return (
    <RTooltip.Provider delayDuration={delay ?? 500} disableHoverableContent>
      <RTooltip.Root open={open} onOpenChange={onOpenChange}>
        <RTooltip.Trigger asChild>{children}</RTooltip.Trigger>
        <RTooltip.Content {...htmlProps} className={clsx(htmlProps.className, 'z-[2] rounded-lg border-2 border-zinc-700 bg-zinc-800 px-3 py-1 text-sm text-zinc-200 max-md:hidden')}>
          {content}
          {(arrow === undefined || arrow) && <RTooltip.Arrow className='fill-zinc-700' />}
        </RTooltip.Content>
      </RTooltip.Root>
    </RTooltip.Provider>
  )
}
