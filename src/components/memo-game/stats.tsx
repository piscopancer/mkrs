import { MemoGame, MemoStore, difficultiesInfo, statesInfo } from '@/memo-game'
import { ease, groupArray, objectEntries } from '@/utils'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { TbClock, TbDeviceGamepad2, TbInfoCircle, TbRepeat, TbTrophy, TbX } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import { StartGameProps, formatTime } from '.'
import { Tooltip } from '../tooltip'

export default function Stats({
  props,
  ...attr
}: {
  props: { memoStore: MemoStore; startGame: (game: StartGameProps) => void }
} & Dialog.DialogTriggerProps) {
  const memoSnap = useSnapshot(props.memoStore)
  const [open, setOpen] = useState(false)
  const totalTime = props.memoStore.gamesPlayed.map((g) => g.time).reduce((p, n) => p + n, 0)
  const completedGames = memoSnap.gamesPlayed.filter((g) => g.state === 'completed')
  const averageTime = completedGames.map((g) => g.time).reduce((p, n) => p + n, 0) / completedGames.length

  function clearHistory() {
    const bestGames = objectEntries(groupArray(props.memoStore.gamesPlayed, (g) => g.difficulty))
      .map(([_, games]) => {
        const completedGames = games.filter((g) => g.state === 'completed')
        return completedGames.length ? completedGames.sort((a, b) => a.time - b.time)[0] : undefined
      })
      .filter(Boolean) as MemoGame[]
    props.memoStore.gamesPlayed = bestGames
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger {...attr} className={clsx(attr.className, 'rounded-lg bg-zinc-800 px-6 py-1.5 text-lg text-zinc-200 duration-100 hover:bg-zinc-700')}>
        Статистика
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
                <div className='overflow-y-auto px-8 max-md:px-4'>
                  <section className='mb-8 grid grid-cols-2 gap-x-4 gap-y-2 text-center max-md:text-sm'>
                    <div className='row-span-3 grid grid-rows-subgrid'>
                      <h1 className='text-zinc-400'>Всего игр</h1>
                      <p className='text-5xl max-md:text-4xl'>{memoSnap.gamesPlayed.length}</p>
                      <p className='text-zinc-400'>{memoSnap.gamesPlayed.filter((g) => g.state === 'completed').length} завершенных</p>
                    </div>
                    <div className='row-span-3 grid grid-rows-subgrid'>
                      <h1 className='text-zinc-400'>Общее время игр</h1>
                      <p className='text-5xl max-md:text-4xl'>{formatTime(totalTime)}</p>
                      <p className='text-zinc-400'>{formatTime(averageTime)} в среднем</p>
                    </div>
                  </section>
                  <section className='mb-10'>
                    <ul className='grid grid-cols-[auto,1fr,auto,auto,auto] gap-x-2 gap-y-1 @lg:mx-14 @lg:gap-x-6'>
                      {objectEntries(groupArray(memoSnap.gamesPlayed, (g) => g.difficulty)).map(([difficulty, groupedGames]) => {
                        const { icon: Icon, name } = difficultiesInfo[difficulty]
                        const completedGames = groupedGames.filter((g) => g.state === 'completed')
                        const bestGame = completedGames.length ? completedGames.sort((a, b) => a.time - b.time)[0] : undefined
                        return (
                          <li key={difficulty} className='relative col-span-full grid grid-cols-subgrid items-center px-2 max-md:text-sm'>
                            <motion.div initial={{ opacity: 0.8, scaleX: 0 }} animate={{ opacity: 1, scaleX: groupedGames.length / memoSnap.gamesPlayed.length, transition: { delay: 0.3, duration: 1, ease } }} className='absolute inset-0 origin-left bg-zinc-800' />
                            <Icon className='relative size-6 self-center max-md:size-5' />
                            <span className='relative'>{name}</span>
                            <Tooltip content='Общее кол-во игр'>
                              <button className='relative flex items-center gap-2 font-mono max-md:gap-1'>
                                <TbDeviceGamepad2 />
                                {groupedGames.length}
                              </button>
                            </Tooltip>
                            <Tooltip content='Лучшее время'>
                              <button className={clsx('relative flex items-center gap-2 font-mono max-md:gap-1', !bestGame && 'opacity-50')}>
                                <TbTrophy className='text-amber-400' />
                                {formatTime(bestGame?.time ?? 0)}
                              </button>
                            </Tooltip>
                            <Tooltip content='Переиграть'>
                              <button
                                disabled={!bestGame}
                                onClick={() => {
                                  if (bestGame) {
                                    props.startGame(props.memoStore.gamesPlayed.find((game) => game.id === bestGame.id)!)
                                    setOpen(false)
                                  }
                                }}
                                className='relative text-zinc-400 duration-100 enabled:hover:text-zinc-200 disabled:opacity-50'
                              >
                                <TbRepeat className='size-9 p-2' />
                              </button>
                            </Tooltip>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                  <section className='mb-12'>
                    <header className='mb-6 flex items-center'>
                      <h2 className='mr-auto font-display text-xl'>История</h2>
                      <button onClick={clearHistory} className='mr-1 px-2 py-1 text-zinc-400 duration-100 hover:text-zinc-200'>
                        Очистить
                      </button>
                      <Tooltip content='Лучшие результаты сохранятся'>
                        <button>
                          <TbInfoCircle className='size-6 stroke-zinc-400 p-1' />
                        </button>
                      </Tooltip>
                    </header>
                    <ul className='grid grid-cols-[1fr,auto,auto]'>
                      {memoSnap.gamesPlayed.toReversed().map((g) => {
                        const stateInfo = statesInfo[g.state]
                        return (
                          <li key={g.id} className={clsx('col-span-full grid grid-cols-subgrid gap-x-2 border-zinc-700 py-2 not-[:last-child]:border-b', g.state === 'cancelled' && 'text-zinc-500')}>
                            <div className='flex items-center gap-2'>
                              <stateInfo.icon className='size-5' />
                              {stateInfo.name}
                            </div>
                            <div className='flex items-center gap-2 font-mono'>
                              <TbClock className='size-4' />
                              {formatTime(g.time)}
                            </div>
                            <Tooltip content='Переиграть'>
                              <button
                                onClick={() => {
                                  props.startGame(props.memoStore.gamesPlayed.find((game) => game.id === g.id)!)
                                  setOpen(false)
                                }}
                                className='text-zinc-400 duration-100 hover:text-zinc-200'
                              >
                                <TbRepeat className='size-9 p-2' />
                              </button>
                            </Tooltip>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
