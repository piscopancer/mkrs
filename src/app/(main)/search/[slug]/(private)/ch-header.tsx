'use client'

import { Tooltip } from '@/components/tooltip'
import useHotkey from '@/hooks/use-hotkey'
import { hotkeys } from '@/hotkeys'
import { searchStore, type TSearchProps } from '@/search'
import { motion, useAnimation } from 'framer-motion'
import { TbArrowUp, TbCopy } from 'react-icons/tb'
import colors from 'tailwindcss/colors'
import { useSnapshot } from 'valtio'
import Save from './save'

export default function ChHeader(props: TSearchProps<'ch'>) {
  const searchSnap = useSnapshot(searchStore)
  const bkrsUrl = `https://bkrs.info/slovo.php?ch=${props.search.ch}`

  const chAnim = useAnimation()
  const ch2Anim = useAnimation()
  const copyBtnAnim = useAnimation()
  const toSearchBtnAnim = useAnimation()

  useHotkey([
    hotkeys['to-search'].keys,
    () => {
      if (!searchSnap.focused) {
        toSearch()
        toSearchBtnAnim.start({
          backgroundColor: [colors.zinc[800], colors.zinc[800], '#00000000'],
        })
      }
    },
  ])
  useHotkey([
    hotkeys.copy.keys,
    (_, e) => {
      if (!searchSnap.focused && !e.ctrlKey) {
        copy()
        copyBtnAnim.start({
          backgroundColor: [colors.zinc[800], colors.zinc[800], '#00000000'],
        })
      }
    },
  ])
  useHotkey([
    hotkeys.bkrs.keys,
    () => {
      if (!searchSnap.focused) window.open(bkrsUrl, '_blank')?.focus()
    },
  ])

  function copy() {
    if (!props.search.ch) return
    navigator.clipboard.writeText(props.search.ch)
    ch2Anim.set({ scale: 1, y: 0 })
    ch2Anim
      .start({
        x: [0, 30, 36, 40, 0],
        opacity: [0.8, 0.8, 0.8, 0.8, 0],
        transition: { duration: 0.5, times: [0, 0.2, 0.7, 0.9, 1] },
      })
      .then(() => {
        chAnim.set({ scale: 1, y: 0, x: 0 })
        chAnim.start({ x: -30, scaleX: 0.8, transition: { ease: 'easeInOut', duration: 0.1 } }).then(() => {
          chAnim.start({ x: 0, scaleX: 1, transition: { type: 'spring', stiffness: 150 } })
        })
      })
  }

  function toSearch() {
    if (!props.search.ch) return
    searchStore.inputValue = props.search.ch
    chAnim.set({ scale: 1, y: 0, x: 0 })
    chAnim.start({ scaleY: 1.2, y: -20, transition: { ease: 'easeInOut', duration: 0.1 } }).then(() => {
      chAnim.start({ scaleY: 1, y: 0, transition: { type: 'spring', stiffness: 200 } })
    })
    ch2Anim.set({ x: 0, y: 0, opacity: 1, scale: 1 })
    ch2Anim.start({ y: -100, opacity: 0, scale: 0.8, transition: { duration: 0.1 } })
  }

  return (
    <>
      <header className='mb-8 flex items-start gap-4'>
        <div className='hopper mr-auto'>
          <motion.span animate={ch2Anim} className='text-5xl'>
            {props.search.ch}
          </motion.span>
          <motion.h1 animate={chAnim} className='relative text-5xl'>
            {props.search.ch}
          </motion.h1>
        </div>
        {props.search.ch && <Save ch={props.search.ch} />}
      </header>
      <div className='mb-8 flex items-end gap-4'>
        <h2 className='mr-auto w-fit max-w-full overflow-hidden text-ellipsis text-nowrap rounded-full bg-zinc-800 px-3 text-base text-zinc-400'>{props.search.py}</h2>
        <aside className='flex rounded-full'>
          <Tooltip
            content={
              <>
                <span className='uppercase text-zinc-500'>({hotkeys['to-search'].display})</span> Копировать в поиск
              </>
            }
          >
            <motion.button animate={toSearchBtnAnim} className='rounded-l-full border-y-2 border-l-2 border-zinc-800 p-2 pl-2.5 duration-100 max-md:active:!bg-zinc-800 md:hover:!bg-zinc-800' onClick={toSearch}>
              <TbArrowUp className='stroke-zinc-400' />
            </motion.button>
          </Tooltip>
          <Tooltip
            content={
              <>
                <span className='uppercase text-zinc-500'>({hotkeys.copy.display})</span> Копировать
              </>
            }
          >
            <motion.button animate={copyBtnAnim} className='border-y-2 border-zinc-800 p-2 duration-100 max-md:active:!bg-zinc-800 md:hover:!bg-zinc-800' onClick={copy}>
              <TbCopy className='stroke-zinc-400' />
            </motion.button>
          </Tooltip>
          <Tooltip
            content={
              <>
                <span className='uppercase text-zinc-500'>({hotkeys.bkrs.display})</span> Открыть на 大БКРС
              </>
            }
          >
            <a target='_blank' href={bkrsUrl} className='rounded-r-full border-y-2 border-r-2 border-zinc-800 p-2 pr-2.5 leading-4 text-zinc-400 duration-100 max-md:active:bg-zinc-800 md:hover:bg-zinc-800'>
              大
            </a>
          </Tooltip>
        </aside>
      </div>
    </>
  )
}
