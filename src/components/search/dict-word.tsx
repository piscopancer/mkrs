'use client'

import { getRandomDictionaryWords } from '@/app/(main)/actions'
import useHotkey from '@/hooks/use-hotkey'
import useStopwatch from '@/hooks/use-stopwatch'
import { hotkeys } from '@/hotkeys'
import { queryKeys } from '@/query'
import { searchStore } from '@/search'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { AnimatePresence, easeOut, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ComponentProps, RefObject, useEffect, useState } from 'react'
import { selectSuggestion } from './utils'

export default function DictWord({ searchInputRef, ...props }: { searchInputRef: RefObject<HTMLInputElement> } & ComponentProps<'div'>) {
  const router = useRouter()
  const dictQuery = useQuery({
    queryKey: queryKeys.dictionary,
    queryFn() {
      return getRandomDictionaryWords()
    },
  })
  const [dictWordIndex, setDictWordIndex] = useState<null | number>(null)
  const dictWord = dictQuery.data && dictWordIndex !== null ? dictQuery.data[dictWordIndex] : null

  const wordStopwatch = useStopwatch({
    interval: 3000,
    onInterval() {
      if (dictQuery.data) {
        setDictWordIndex((prev) => {
          if (prev === null) return 1
          if (!dictQuery.data) return null
          if (prev + 1 === dictQuery.data.length) {
            return 0
          } else {
            return prev + 1
          }
        })
      }
    },
  })

  useEffect(() => {
    wordStopwatch.start()
  }, [dictQuery.data])

  useHotkey(hotkeys.search.keys, () => {
    const search = searchInputRef.current?.value.trim()
    if (!search && dictQuery.data && dictWordIndex !== null) {
      selectSuggestion(router, dictQuery.data[dictWordIndex])
      searchStore.search.set(dictQuery.data[dictWordIndex])
      searchStore.completeDebounce()
    }
  })

  return (
    <aside {...props} className={clsx('pointer-events-none flex h-14 items-center pl-6', props.className)}>
      <AnimatePresence mode='popLayout'>
        <motion.p
          exit={{
            y: '50%',
            opacity: 0,
            transition: {
              ease: easeOut,
            },
          }}
          initial={{
            y: '-50%',
            opacity: 0,
          }}
          animate={{
            y: '0%',
            opacity: 1,
            transition: {
              ease: easeOut,
            },
          }}
          key={dictWord}
          className='absolute italic text-zinc-500'
        >
          {dictWord}
        </motion.p>
      </AnimatePresence>
    </aside>
  )
}
