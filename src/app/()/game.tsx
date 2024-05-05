'use client'

import MemoGame from '@/components/memo-game'
import { memoStore } from '@/memo-game'
import { ease } from '@/utils'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { TbDeviceGamepad2, TbX } from 'react-icons/tb'

export default function Game() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className={clsx('flex items-center justify-center rounded-full px-4 py-2 text-zinc-200 max-md:active:bg-zinc-800 md:hover:bg-zinc-800')}>
          <TbDeviceGamepad2 className='size-6' />
        </button>
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <motion.div exit={{ opacity: 0, transition: { duration: 0.1 } }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Dialog.Overlay className='fixed inset-0 bg-black/50' />
            </motion.div>
            <Dialog.Content asChild>
              <motion.div
                exit={{ opacity: 0.5, y: '100dvh', transition: { duration: 0.3, ease: 'easeOut' } }}
                initial={{ opacity: 0.5, y: '100dvh', scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease } }}
                className='fixed inset-0 flex grow flex-col bg-zinc-900 @container max-md:my-4'
              >
                <Dialog.Trigger className='ml-auto block text-zinc-400 duration-100 hover:text-zinc-200'>
                  <TbX className='size-16 p-4' />
                </Dialog.Trigger>
                <MemoGame props={{ memoStore }} className='mx-8 grow max-md:mx-4' />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
