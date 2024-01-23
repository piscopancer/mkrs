'use client'

import useKey from '@/hooks/use-key'
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

export default function Recent() {
  const recentSnap = useSnapshot(recentStore)
  const savedSnap = useSnapshot(savedStore)
  const selfAnim = useAnimation()

  useEffect(() => {
    selfAnim.set({ opacity: 0 })
    selfAnim.start({ opacity: 1 })
  }, [selfAnim])

  useKey([
    ['r'],
    () => {
      const date = new Date(2024, 0, 18, 16)
      recentStore.recent.push({
        date,
        search: 'сексуальный мужчина',
      })
    },
  ])

  return (
    <motion.main animate={selfAnim} className='mb-48'>
      <h1 className='text-lg font-display text-zinc-200 uppercase mb-8'>недавние</h1>
      {objectEntries(groupByDate(recentSnap.recent)).map(([id, { name, recent }]) =>
        recent.length ? (
          <Fragment key={id}>
            <h2 className='ext-lg text-zinc-300 font-medium mb-6'>{name}</h2>
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
                        className={classes(saved ? 'text-pink-500 hover:text-pink-300' : 'text-zinc-600 hover:text-zinc-400', 'h-8 w-8 flex items-center justify-center mr-2 group py-0.5 -ml-2')}
                      >
                        <TbDeviceFloppy className='group-hover:scale-110 duration-100' />
                      </button>
                      <Link href={`/search/${r.search}`} className='flex items-center group flex-1 py-0.5 min-w-0'>
                        <span className='text-pink-500 group-hover:text-pink-300 md:text-lg overflow-hidden text-ellipsis text-nowrap'>{r.search}</span>
                        <span className='text-xs rounded-full text-zinc-400 ml-auto group-hover:text-zinc-200 text-nowrap'>{formatDistanceToNowStrict(r.date, { locale: ru, roundingMethod: 'floor' })}</span>
                      </Link>
                    </li>
                  )
                })}
            </ul>
          </Fragment>
        ) : null
      )}
    </motion.main>
  )
}
