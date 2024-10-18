'use client'

import { Example } from '@/reverso'
import { stringToReact } from '@/utils'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { TbX } from 'react-icons/tb'

export default function Examples({ examples, ...htmlProps }: Dialog.DialogTriggerProps & { examples: Example[] | null }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger {...htmlProps} disabled={!examples || !examples.length} className={clsx(htmlProps.className, 'text-zinc-400 duration-100 enabled:hover:text-zinc-200 disabled:opacity-50')}>
        Примеры
      </Dialog.Trigger>
      <AnimatePresence>
        {open && !!examples && (
          <Dialog.Portal forceMount>
            <motion.div exit={{ opacity: 0, transition: { duration: 0.1 } }} initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}>
              <Dialog.Overlay className='fixed inset-0 bg-black' />
            </motion.div>
            <Dialog.Content asChild>
              <motion.article
                //
                exit={{ opacity: 0, y: 10 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className='fixed inset-0 mx-auto my-4 flex max-w-screen-md grow flex-col rounded-xl bg-zinc-900 max-md:mx-4 max-md:my-4'
              >
                <header className='flex items-center'>
                  <h1 className='ml-8 mr-auto font-display text-lg max-md:ml-4'>Примеры</h1>
                  <Dialog.Trigger className='block text-zinc-400 duration-100 hover:text-zinc-200'>
                    <TbX className='size-16 p-4' />
                  </Dialog.Trigger>
                </header>
                <div className='overflow-y-auto px-8 pb-16 max-md:px-4'>
                  <ul className='grid grid-cols-2 gap-x-4'>
                    {examples.map((ex, i) => (
                      <li key={i} className='col-span-full grid grid-cols-subgrid border-zinc-800 py-2 text-zinc-400 not-[:last-child]:border-b [&_em]:not-italic [&_em]:text-zinc-200'>
                        <span>{stringToReact(ex.original)}</span>
                        <span>{stringToReact(ex.translation)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
