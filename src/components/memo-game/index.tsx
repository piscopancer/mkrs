'use client'

import useStopwatch from '@/hooks/use-stopwatch'
import { difficultiesInfo, statesInfo, type MemoGame, type MemoStore } from '@/memo-game'
import { recentStore } from '@/recent'
import { savedStore } from '@/saved'
import { TComponent, clone, ease, getShuffledArray, groupArray, objectEntries, randomItemsFromArray, wait } from '@/utils'
import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { intervalToDuration } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { IconType } from 'react-icons'
import { TbClock, TbClockPlay, TbDeviceFloppy, TbDeviceGamepad2, TbEraser, TbExternalLink, TbHandStop, TbHistory, TbInfoCircle, TbPlayerPause, TbPlayerPlay, TbPlus, TbRepeat, TbTrophy, TbX } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import { debugStore } from '../debug'
import { Tooltip } from '../tooltip'

function formatTime(seconds: number, withHours?: true) {
  let duration = intervalToDuration({ start: 0, end: seconds * 1000 })
  return (withHours ? [duration.hours, duration.minutes, duration.seconds] : [(duration.minutes ?? 0) + (duration.hours ?? 0) * 60, duration.seconds]).map((dur) => String(dur ?? 0).padStart(2, '0')).join(':')
}

const columns = {
  easy: 4,
  hard: 6,
  medium: 6,
} as const satisfies Record<keyof typeof difficultiesInfo, number>

const wordsGroups = {
  recent: {
    name: 'Недавние',
    icon: TbHistory,
    get: () => recentStore.recent.map((r) => r.search),
  },
  saved: {
    name: 'Сохраненные',
    icon: TbDeviceFloppy,
    get: () => savedStore.saved,
  },
} as const satisfies Record<string, { name: string; icon: IconType; get: () => string[] }>

export default function MemoGame({ props, ...attr }: TComponent<'article', { memoStore: MemoStore }>) {
  const memoSnap = useSnapshot(props.memoStore)
  const [wordsGroup, setWordsGroup] = useState<keyof typeof wordsGroups>('recent')
  const [cards, setCards] = useState<string[]>([])
  const [card1, setCard1] = useState<number | undefined>()
  const [card2, setCard2] = useState<number | undefined>()
  const [clickable, setClickable] = useState(true)
  const wordInputRef = useRef<HTMLInputElement>(null!)
  const stopwatchRef = useRef<HTMLParagraphElement>(null!)
  const stopwatch = useStopwatch({
    interval: 1,
    onInterval: (t) => {
      stopwatchRef.current.innerText = formatTime(t)
      if (props.memoStore.currentGame) props.memoStore.currentGame.time = t
      debugStore.memo_time = t
    },
  })
  const startButtonEnabled = memoSnap.gameSettings.words.length >= difficultiesInfo[memoSnap.gameSettings.difficulty].words && (!memoSnap.currentGame || memoSnap.currentGame.state === 'completed')

  function startGame(_game: Pick<MemoGame, 'difficulty' | 'words'>) {
    const seed = Math.floor(Math.random() * 100)
    const game = clone(_game)
    const words = game.words.length > difficultiesInfo[game.difficulty].words ? randomItemsFromArray(game.words, difficultiesInfo[game.difficulty].words) : game.words
    game.words = words
    props.memoStore.currentGame = {
      ...game,
      id: crypto.randomUUID(),
      seed,
      time: 0,
      state: 'active',
      solvedWords: [],
    }
    setCards(getShuffledArray([...words, ...words], seed))
    stopwatch.start()
  }

  async function pauseGame(game: MemoGame) {
    game.state = 'paused'
    setClickable(false)
    stopwatch.pause()
  }

  async function resumeGame(game: MemoGame) {
    game.state = 'active'
    setClickable(true)
    stopwatch.resume()
  }

  function cancelGame() {
    props.memoStore.currentGame = null
    setCard1(undefined)
    setCard2(undefined)
    setClickable(false)
    stopwatch.stop()
    setCards([])
    setClickable(true)
  }

  async function onCardClick(game: MemoGame, index: number) {
    if (card1 === undefined) {
      setCard1(index)
    } else {
      setCard2(index)
      setClickable(false)
      if (cards[card1] === cards[index]) {
        await wait(0.25)
        const solvedWords = [...game.solvedWords, cards[card1]]
        game.solvedWords = [...solvedWords]
        if (solvedWords.length === difficultiesInfo[game.difficulty].words) {
          setClickable(false)
          game.state = 'completed'
          stopwatch.stop()
          wait(0.5)
          // show congrats screen 🎉
          // props.memoStore.currentGame = undefined
        }
      } else {
        await wait(1)
      }
      setCard2(undefined)
      setCard1(undefined)
      setClickable(true)
    }
  }

  useEffect(() => {
    if (props.memoStore.currentGame) {
      stopwatch.set(props.memoStore.currentGame.time)
      pauseGame(props.memoStore.currentGame)
      setCards(getShuffledArray([...props.memoStore.currentGame.words, ...props.memoStore.currentGame.words], props.memoStore.currentGame.seed))
    }
  }, [])

  useEffect(() => {
    debugStore.memo_rerenders += 1
  })

  return (
    <article {...attr} className={clsx(attr.className, 'grid grid-cols-[1fr,1fr] gap-12')}>
      <section className='flex w-full flex-col justify-self-center overflow-hidden'>
        <header className='hopper mb-4'>
          <div className='mx-auto mt-1 h-4 w-4/5 rounded-full bg-zinc-800'></div>
          <div className='mx-auto h-4 w-4/5 overflow-hidden rounded-full'>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: memoSnap.currentGame ? memoSnap.currentGame.solvedWords.length / difficultiesInfo[memoSnap.currentGame.difficulty].words : 0,
                transition: { ease },
              }}
              className='h-full origin-left bg-pink-500'
            ></motion.div>
          </div>
        </header>
        <div about='game-board' className={clsx('mb-4 h-0 w-full grow duration-100', memoSnap.currentGame?.state === 'paused' && 'opacity-50')}>
          {memoSnap.currentGame ? (
            <ul
              className='relative left-1/2 top-1/2 grid max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 gap-1'
              style={{
                aspectRatio: columns[memoSnap.currentGame.difficulty] / ((difficultiesInfo[memoSnap.currentGame.difficulty].words * 2) / columns[memoSnap.currentGame.difficulty]),
                gridTemplateColumns: `repeat(${columns[memoSnap.currentGame.difficulty]}, minmax(0, 1fr))`,
              }}
            >
              {cards.map((word, i) => {
                const selected = i === card1 || i === card2
                const solved = props.memoStore.currentGame!.solvedWords.includes(word)
                return (
                  <li key={word + i} className='contents'>
                    <button
                      disabled={!clickable}
                      onClick={() => onCardClick(props.memoStore.currentGame!, i)}
                      className={clsx('hopper bg-zinc-800 duration-200 @container-[size] [perspective:100px] [transform-style:preserve-3d]', selected && '!bg-zinc-700', selected || solved ? 'pointer-events-none [transform:rotateY(0deg)]' : '[transform:rotateY(180deg)]')}
                    >
                      <div className={clsx('hopper size-full place-self-center overflow-hidden')}>
                        <div className={clsx(solved ? 'scale-150 duration-500' : 'scale-0', 'h-full w-full rounded-full bg-pink-400 ease-out')} />
                      </div>
                      <span style={{ fontSize: `${50 / word.length}cqi` }} className={clsx('flex size-full items-center justify-center place-self-center stroke-zinc-500 [transform:translateZ(1rem)]', solved && '!text-zinc-900', selected && '!text-zinc-400 duration-1000')}>
                        {word}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className='relative left-1/2 top-1/2 aspect-square h-1/2 max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 bg-zinc-800/50'></div>
          )}
        </div>
        <footer className='mb-8 flex w-fit items-center self-center'>
          <div className='mr-12 flex items-center font-mono'>
            <TbClockPlay className='mr-3 size-6' />
            <p ref={stopwatchRef}>{formatTime(0)}</p>
          </div>
          <button
            disabled={!memoSnap.currentGame || memoSnap.currentGame.state === 'completed'}
            onClick={() => {
              if (!props.memoStore.currentGame) return
              if (props.memoStore.currentGame.state === 'active') {
                pauseGame(props.memoStore.currentGame)
              } else if (props.memoStore.currentGame.state === 'paused') {
                resumeGame(props.memoStore.currentGame)
              }
            }}
            className='mr-2 rounded-md bg-zinc-800 text-zinc-400 duration-100 enabled:hover:text-zinc-200 disabled:opacity-50'
          >
            {memoSnap.currentGame?.state === 'active' ? <TbPlayerPause className='size-12 p-3' /> : <TbPlayerPlay className='size-12 p-3' />}
          </button>
          <button disabled={!memoSnap.currentGame || memoSnap.currentGame.state === 'completed'} onClick={cancelGame} className='rounded-md bg-zinc-800 text-zinc-400 duration-100 enabled:hover:text-zinc-200 disabled:opacity-50'>
            <TbHandStop className='size-12 p-3' />
          </button>
        </footer>
      </section>
      <section about='game-settings'>
        <h2 className='mb-4 font-display'>Сложность</h2>
        <menu className='mb-6 flex w-full gap-4'>
          {objectEntries(difficultiesInfo).map(([d, info]) => {
            const selected = props.memoStore.gameSettings.difficulty === d
            return (
              <li key={d} className='contents'>
                <button disabled={selected} onClick={() => (props.memoStore.gameSettings.difficulty = d)} className={clsx('hopper h-20 max-w-40 flex-1 rounded-lg border-2 border-zinc-700 bg-zinc-800 duration-100', selected ? 'opacity-100' : 'opacity-50')}>
                  <span className={clsx('mr-4 mt-2 justify-self-end text-xl')}>{info.words}</span>
                  <div className={clsx('mx-3 mb-1 self-end justify-self-start')}>{info.name}</div>
                  <info.icon className={clsx('ml-3 mt-2 size-8 self-start duration-100', selected ? 'scale-100' : 'scale-90')} />
                </button>
              </li>
            )
          })}
        </menu>
        <h2 className='mb-4 font-display'>Слова</h2>
        <section className='mb-8 grid h-72 grid-cols-[3fr,2fr] grid-rows-[auto,1fr] overflow-hidden rounded-lg border-2 border-zinc-800'>
          <header className='flex gap-5'>
            <h2 className='self-center py-1.5 pl-4'>
              <span className={clsx('duration-100', memoSnap.gameSettings.words.length / difficultiesInfo[memoSnap.gameSettings.difficulty].words < 1 ? 'text-zinc-500' : 'text-zinc-200')}>{memoSnap.gameSettings.words.length}</span>
              <span className='text-zinc-500'>/</span>
              {difficultiesInfo[memoSnap.gameSettings.difficulty].words}
            </h2>
            <Tooltip content='Если слов будет больше, чем нужно, они будут выбираться случайным образом.'>
              <button className='cursor-default'>
                <TbInfoCircle className='size-4 stroke-zinc-400' />
              </button>
            </Tooltip>
            <button onClick={() => (props.memoStore.gameSettings.words = [])} className='ml-auto flex aspect-square h-full items-center justify-center self-center text-zinc-400 duration-100 hover:text-zinc-200'>
              <TbEraser className='size-5' />
            </button>
          </header>
          <header className='border-l-2 border-zinc-800'>
            <menu className='flex h-full'>
              {objectEntries(wordsGroups).map(([group, info]) => (
                <li className='contents' key={group}>
                  <button onClick={() => setWordsGroup(group)} className={clsx('flex flex-1 items-center justify-center', wordsGroup === group ? 'bg-zinc-800' : '')}>
                    <info.icon className='size-5' />
                  </button>
                </li>
              ))}
            </menu>
          </header>
          <menu about='selected-words' className='flex h-auto flex-wrap items-center self-start px-3 py-2'>
            {memoSnap.gameSettings.words.map((w) => (
              <li key={w} className='contents'>
                <button onClick={() => (props.memoStore.gameSettings.words = props.memoStore.gameSettings.words.filter((word) => word !== w))} className='px-2 py-1 text-2xl duration-100 hover:text-zinc-400'>
                  {w}
                </button>
              </li>
            ))}
            <li className='flex px-2 py-[calc(theme(padding.1)-2px)]'>
              <input ref={wordInputRef} type='text' className='w-[8ch] rounded-l-lg border-y-2 border-l-2 border-zinc-800 bg-transparent px-2 text-center text-2xl text-zinc-500 duration-100 hover:border-zinc-700 focus:text-zinc-200' />
              <button
                onClick={() => {
                  wordInputRef.current.focus()
                  const word = wordInputRef.current.value.trim()
                  if (word) {
                    wordInputRef.current.value = ''
                    props.memoStore.gameSettings.words.push(word)
                  }
                }}
                className='flex aspect-square grow items-center justify-center rounded-r-lg border-y-2 border-r-2 border-zinc-800 bg-zinc-800 px-1 duration-100 hover:bg-zinc-700'
              >
                <TbPlus className='size-5' />
              </button>
            </li>
          </menu>
          <menu className='flex flex-col overflow-y-auto border-l-2 border-zinc-800'>
            {wordsGroups[wordsGroup]
              .get()
              .toReversed()
              .map((w) => (
                <li className='flex' key={w}>
                  <button disabled={memoSnap.gameSettings.words.includes(w)} onClick={() => props.memoStore.gameSettings.words.push(w)} className='grow py-0.5 pl-3 text-left text-2xl text-zinc-400 duration-100 enabled:hover:text-zinc-200 disabled:opacity-50'>
                    {w}
                  </button>
                  <button className='flex items-center justify-center px-2 text-zinc-400 duration-100 hover:text-zinc-200'>
                    <TbDeviceFloppy className='size-5' />
                  </button>
                  <a target='_blank' href={`/search/${w}`} className='flex items-center justify-center px-2 text-zinc-400 duration-100 hover:text-zinc-200'>
                    <TbExternalLink className='size-5' />
                  </a>
                </li>
              ))}
          </menu>
        </section>
        <section className='flex'>
          <button disabled={!startButtonEnabled} onClick={() => startGame(props.memoStore.gameSettings)} className='origin-left rounded-lg bg-zinc-800 px-6 py-1.5 text-lg text-zinc-200 duration-100 enabled:hover:bg-zinc-700  disabled:opacity-50'>
            Начать
          </button>
          <Stats gamesPlayed={props.memoStore.gamesPlayed} />
        </section>
      </section>
    </article>
  )
}

function Stats({ gamesPlayed }: { gamesPlayed: MemoGame[] }) {
  const [open, setOpen] = useState(false)
  const totalTime = gamesPlayed.map((g) => g.time).reduce((prev, next) => prev + next, 0)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className='ml-auto rounded-lg bg-zinc-800 px-6 py-1.5 text-lg text-zinc-200 duration-100 hover:bg-zinc-700'>Статистика</Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <motion.div exit={{ opacity: 0, transition: { duration: 0.1 } }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Dialog.Overlay className='fixed inset-0 bg-black/50' />
            </motion.div>
            <Dialog.Content asChild>
              <motion.div exit={{ opacity: 0, y: 50, transition: { duration: 0.1 } }} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className='fixed inset-0 mx-auto my-12 flex max-w-screen-md grow flex-col rounded-xl bg-zinc-900 @container max-md:my-4'>
                <Dialog.Trigger className='ml-auto block text-zinc-400 duration-100 hover:text-zinc-200'>
                  <TbX className='size-16 p-4' />
                </Dialog.Trigger>
                <div className='overflow-y-auto px-8'>
                  <section className='mb-8 grid grid-cols-2 gap-x-4 gap-y-2'>
                    <div className='row-span-3 grid grid-rows-subgrid text-center'>
                      <h1 className='text-zinc-400'>Всего игр</h1>
                      <p className='text-5xl'>{gamesPlayed.length}</p>
                      <p className='text-zinc-400'>{gamesPlayed.filter((g) => g.state === 'completed').length} завершенных</p>
                    </div>
                    <div className='row-span-3 grid grid-rows-subgrid text-center'>
                      <h1 className='text-zinc-400'>Общее время игр</h1>
                      <p className='text-5xl'>{formatTime(totalTime)}</p>
                      <p className='text-zinc-400'>{formatTime(totalTime / gamesPlayed.length)} в среднем</p>
                    </div>
                  </section>
                  <section className='mb-10'>
                    <ul className='grid grid-cols-[auto,1fr,auto,auto,auto] gap-x-4 gap-y-1 @lg:mx-14 @lg:gap-x-6'>
                      {objectEntries(groupArray(gamesPlayed, (g) => g.difficulty)).map(([difficulty, groupedGames]) => {
                        const { icon: Icon, name } = difficultiesInfo[difficulty]
                        return (
                          <li key={difficulty} className='relative col-span-full grid grid-cols-subgrid items-center px-2'>
                            <motion.div initial={{ opacity: 0.8, scaleX: 0 }} animate={{ opacity: 1, scaleX: groupedGames.length / gamesPlayed.length, transition: { delay: 0.3, duration: 1, ease } }} className='absolute inset-0 origin-left bg-zinc-800' />
                            <Icon className='relative size-6 self-center' />
                            <span className='relative'>{name}</span>
                            <div className='relative flex items-center gap-2 font-mono'>
                              <TbDeviceGamepad2 />
                              {groupedGames.length}
                            </div>
                            <div className='relative flex items-center gap-2 font-mono'>
                              <TbTrophy className='text-amber-400' />
                              {formatTime(groupedGames.map((g) => g.time).sort((a, b) => a - b)[0])}
                            </div>
                            <Tooltip content='Переиграть'>
                              <button className='text-zinc-400 duration-100 hover:text-zinc-200'>
                                <TbRepeat className='size-9 p-2' />
                              </button>
                            </Tooltip>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                  <section className='mb-12'>
                    <header className='mb-6'>
                      <h2 className='text-center font-display text-xl'>История</h2>
                    </header>
                    <ul className='grid grid-cols-[1fr,auto,auto]'>
                      {gamesPlayed.map((g) => {
                        const stateInfo = statesInfo[g.state]
                        return (
                          <li key={g.id} className={clsx('not-[:last-child]:border-b col-span-full grid grid-cols-subgrid gap-x-2 border-zinc-700 py-2', g.state === 'cancelled' && 'text-zinc-500')}>
                            <div className='flex items-center gap-2'>
                              <stateInfo.icon className='size-5' />
                              {stateInfo.name}
                            </div>
                            <div className='flex items-center gap-2 font-mono'>
                              <TbClock className='size-4' />
                              {formatTime(g.time)}
                            </div>
                            <Tooltip content='Переиграть'>
                              <button className='text-zinc-400 duration-100 hover:text-zinc-200'>
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
