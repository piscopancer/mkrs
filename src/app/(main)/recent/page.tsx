'use client'

import Vibrator from '@/components/vibrator'
import { groupByDate, recentStore } from '@/recent'
import { savedStore } from '@/saved'
import { classes, objectEntries } from '@/utils'
import { compareDesc, formatDistanceToNowStrict } from 'date-fns'
import { ru } from 'date-fns/locale'
import { motion, useAnimation } from 'framer-motion'
import Link from 'next/link'
import { Fragment, useEffect } from 'react'
import { TbDeviceFloppy } from 'react-icons/tb'
import { useSnapshot } from 'valtio'

export default function RecentPage() {
  const recentSnap = useSnapshot(recentStore)
  const savedSnap = useSnapshot(savedStore)
  const selfAnim = useAnimation()

  useEffect(() => {
    selfAnim.set({ opacity: 0 })
    selfAnim.start({ opacity: 1 })
  }, [selfAnim])

  return (
    <motion.main animate={selfAnim} className='mb-48'>
      <h1 className='mb-8 font-display text-lg uppercase text-zinc-200'>недавние</h1>
      {objectEntries(groupByDate(recentSnap.recent)).map(([id, { name, recent }]) =>
        recent.length ? (
          <Fragment key={id}>
            <h2 className='ext-lg mb-6 font-medium text-zinc-300'>{name}</h2>
            <ul className='mb-10'>
              {recent
                .toSorted((a, b) => compareDesc(a.date, b.date))
                .map((r, i) => {
                  const saved = savedSnap.saved.find((s) => s === r.search)
                  return (
                    <li key={r.search + '_' + i} className='flex items-center'>
                      <button
                        onClick={() => {
                          saved ? (savedStore.saved = savedStore.saved.filter((s) => s !== r.search)) : savedStore.saved.push(r.search)
                        }}
                        className={classes(saved ? 'text-pink-500 max-md:active:text-pink-300 md:hover:text-pink-300' : 'text-zinc-600 max-md:active:text-zinc-400 md:hover:text-zinc-400', 'group -ml-2 mr-2 flex h-8 w-8 items-center justify-center py-0.5')}
                      >
                        <TbDeviceFloppy className='duration-100 group-hover:scale-110' />
                        <Vibrator />
                      </button>
                      <Link prefetch={false} href={`/search/${r.search}`} className='group flex min-w-0 flex-1 items-center py-0.5'>
                        <span className='overflow-hidden text-ellipsis text-nowrap text-lg text-pink-500 duration-100 max-md:group-active:text-pink-300 md:text-lg md:group-hover:text-pink-300'>{r.search}</span>
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
