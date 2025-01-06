'use client'

import { modifyTr } from '@/bkrs'
import { lastWordSelectorStore, selectedWordsStore } from '@/stores/selected-words'
import { replaceButtonsWithWordsSelectors } from '@/temp'
import { stringToReact } from '@/utils'
import clsx from 'clsx'
import { ComponentProps, useEffect } from 'react'

export default function Tr({ tr, ...props }: ComponentProps<'div'> & { tr: string }) {
  let modTr = modifyTr(tr)

  useEffect(() => {
    return () => {
      selectedWordsStore.clearWords()
      lastWordSelectorStore.ref.current.set(null)
    }
  }, [])

  return (
    <div {...props} data-search className={clsx('text-xl max-md:text-base', props.className)}>
      {stringToReact(modTr, {
        replace: replaceButtonsWithWordsSelectors,
      })}
    </div>
  )
}
