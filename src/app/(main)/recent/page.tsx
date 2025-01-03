'use client'

import Vibrator from '@/components/vibrator'
import { groupByDate } from '@/recent'
import { recentStore } from '@/stores/recent'
import { savedStore } from '@/stores/saved'
import { objectEntries } from '@/utils'
import clsx from 'clsx'
import { compareDesc, formatDistanceToNowStrict } from 'date-fns'
import { ru } from 'date-fns/locale'
import { motion, useAnimation } from 'framer-motion'
import Link from 'next/link'
import { Fragment, useEffect } from 'react'
import { TbDeviceFloppy } from 'react-icons/tb'

export default function RecentPage() {
  const recentSnap = recentStore.use()
  const savedSnap = savedStore.use()
  const selfAnim = useAnimation()

  useEffect(() => {
    selfAnim.set({ opacity: 0 })
    selfAnim.start({ opacity: 1 })
  }, [selfAnim])

  return (
    <motion.main animate={selfAnim} className='mb-48'>
      <h1 className='mb-8 font-display text-xl font-medium text-zinc-200'>История</h1>
      {objectEntries(groupByDate(recentSnap.recent)).map(([id, { name, recent }]) =>
        recent.length ? (
          <Fragment key={id}>
            <h2 className='mb-6 font-medium text-zinc-300'>{name}</h2>
            <ul className='mb-10'>
              {recent
                .toSorted((a, b) => compareDesc(a.date, b.date))
                .map((r, i) => {
                  const saved = savedSnap.saved.find((s) => s === r.search)
                  return (
                    <li key={r.search + '_' + i} className='group/li -mx-2 flex items-center rounded-md px-2 hover:bg-zinc-800/50'>
                      <button
                        onClick={() => {
                          if (saved) {
                            savedStore.saved.set(savedStore.saved.get().filter((s) => s !== r.search))
                          } else {
                            savedStore.saved.set((draft) => {
                              draft.push(r.search)
                            })
                          }
                        }}
                        className={clsx('group mr-4 flex aspect-square items-center justify-center rounded-full border-2 border-transparent p-1.5', saved ? 'bg-pink-500/10 text-pink-500' : 'border-zinc-800 text-zinc-200')}
                      >
                        <TbDeviceFloppy className='size-5 duration-100' />
                        <Vibrator />
                      </button>
                      <Link href={`/search/${r.search}`} className='group flex min-w-0 flex-1 items-center border-b border-zinc-800 py-3 group-last/li:border-0 max-md:py-4'>
                        <span className='line-clamp-1 text-zinc-200 duration-100 md:text-lg'>{r.search}</span>
                        <span className='ml-auto text-nowrap rounded-full text-xs text-zinc-400 duration-100 max-md:group-active:text-zinc-200 md:group-hover:text-zinc-200'>{formatDistanceToNowStrict(r.date, { locale: ru, roundingMethod: 'floor' })}</span>
                      </Link>
                    </li>
                  )
                })}
            </ul>
          </Fragment>
        ) : null,
      )}
    </motion.main>
  )
}
