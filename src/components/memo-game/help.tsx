import { difficultiesInfo } from '@/memo-game'
import { objectEntries } from '@/utils'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { TbInfoCircle, TbX } from 'react-icons/tb'
import MarkdownArticle from '../markdown'

export default function Help({ ...attr }: Dialog.DialogTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger {...attr} className={clsx(attr.className, 'rounded-lg bg-zinc-800 px-6 py-1.5 text-lg text-zinc-200 duration-100 hover:bg-zinc-700 @max-md/settings:px-4')}>
        <span className='@max-md/settings:hidden'>Как играть</span>
        <TbInfoCircle className='size-6 @md/settings:hidden' />
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <motion.div exit={{ opacity: 0, transition: { duration: 0.1 } }} initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}>
              <Dialog.Overlay className='fixed inset-0 bg-black' />
            </motion.div>
            <Dialog.Content asChild>
              <motion.div exit={{ opacity: 0, y: 50, transition: { duration: 0.1 } }} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className='fixed inset-0 mx-auto my-12 flex max-w-screen-md grow flex-col rounded-xl bg-zinc-900 @container max-md:mx-4 max-md:my-4'>
                <Dialog.Trigger className='ml-auto block text-zinc-400 duration-100 hover:text-zinc-200'>
                  <TbX className='size-16 p-4' />
                </Dialog.Trigger>
                <MarkdownArticle className='overflow-y-auto px-8 pb-16 max-md:px-4'>
                  {`
# Игра на память

## Суть игры

Вам нужно искать парные карточки, переворачивая их по 2 штуки за ход. Сначала вы выбираете вслепую, если не выходит угадать пару, то вам стоит запомнить эти две картоки в любом случае, так как они понадобятся вам в будущем. Держите в памяти, где какие карточки находятся и в итоге вы найдете пару для каждой.
`}
                  <aside className='flex gap-2 @container'>
                    {(['请求', '调整', '请求', '调整'] as const).map((w, i, arr) => (
                      <div key={i} style={{ fontSize: `${50 / arr.length / w.length}cqi` }} className={clsx('flex aspect-square flex-1 items-center justify-center', w === '请求' ? 'bg-zinc-700' : 'bg-zinc-800 text-zinc-500')}>
                        {w}
                      </div>
                    ))}
                  </aside>
                  {`
## Как начать

Выберите сложность и нужное кол-во слов для этой сложности:

${objectEntries(difficultiesInfo)
  .map(([_, info]) => `- ${info.name}: \`${info.words}\``)
  .join('\n')}

Если вы выберете больше, чем нужно, то слова будут выбраны случайным образом, остальные отбросятся. Нажмите кнопку <kbd>Начать</kbd> и игра запустится.

## Польза игры

Игра на память призвана помочь вам запомнить иероглифы. Путаете местами **运** и **动**? — Не стесняйтесь добавлять их в игровой список и играйте до потери пульса.
`}
                </MarkdownArticle>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
