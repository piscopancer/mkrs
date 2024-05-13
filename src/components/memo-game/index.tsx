'use client'

import useStopwatch from '@/hooks/use-stopwatch'
import { difficultiesInfo, type MemoGame, type MemoStore } from '@/memo-game'
import { recentStore } from '@/recent'
import { savedStore } from '@/saved'
import { TComponent, clone, ease, getShuffledArray, objectEntries, randomItemsFromArray, route, wait } from '@/utils'
import clsx from 'clsx'
import crypto from 'crypto'
import { intervalToDuration } from 'date-fns'
import { AnimatePresence, animate, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { IconType } from 'react-icons'
import { TbClockPlay, TbDeviceFloppy, TbEraser, TbExternalLink, TbGridPattern, TbHandStop, TbHistory, TbInfoCircle, TbPlayerPause, TbPlayerPlay, TbPlus } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import { debugStore } from '../debug'
import { Tooltip } from '../tooltip'
import Help from './help'
import Stats from './stats'

export function formatTime(seconds: number, withHours?: true) {
  let duration = intervalToDuration({ start: 0, end: seconds * 1000 })
  return (withHours ? [duration.hours, duration.minutes, duration.seconds] : [(duration.minutes ?? 0) + (duration.hours ?? 0) * 60, duration.seconds]).map((dur) => String(dur ?? 0).padStart(2, '0')).join(':')
}

export type StartGameProps = Pick<MemoGame, 'difficulty' | 'words'> & { seed?: MemoGame['seed'] }

const columns = {
  easy: 4,
  hard: 6,
  medium: 6,
} as const satisfies Record<keyof typeof difficultiesInfo, number>

const suggestedWordsGroups = {
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
  const [suggestedWordsGroup, setSuggestedWordsGroup] = useState<keyof typeof suggestedWordsGroups>('recent')
  const [cards, setCards] = useState<string[]>([])
  const [card1, setCard1] = useState<number | null>(null)
  const [card2, setCard2] = useState<number | null>(null)
  const [clickable, setClickable] = useState(true)
  const wordInputRef = useRef<HTMLInputElement>(null!)
  const [wordToAdd, setWordToAdd] = useState('')
  const stopwatchRef = useRef<HTMLParagraphElement>(null)
  const stopwatch = useStopwatch({
    interval: 1,
    onInterval: (t) => {
      if (stopwatchRef.current) stopwatchRef.current.innerText = formatTime(t)
      if (props.memoStore.currentGame) props.memoStore.currentGame.time = t
      debugStore.memo_time = t
    },
  })
  const startButtonEnabled = memoSnap.gameSettings.words.length >= difficultiesInfo[memoSnap.gameSettings.difficulty].words && (!memoSnap.currentGame || memoSnap.currentGame.state === 'completed') && !cards.length

  function startGame(_game: StartGameProps) {
    const seed = _game.seed ?? Math.floor(Math.random() * 100)
    const game = clone(_game)
    const words = game.words.length > difficultiesInfo[game.difficulty].words ? randomItemsFromArray(game.words, difficultiesInfo[game.difficulty].words) : game.words
    game.words = words
    props.memoStore.currentGame = {
      ...game,
      id: crypto.randomBytes(4).toString('hex'),
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

  function cancelGame(game: MemoGame) {
    game.state = 'cancelled'
    props.memoStore.gamesPlayed.push(game)
    props.memoStore.currentGame = null
    setCard1(null)
    setCard2(null)
    stopwatch.stop()
    setCards([])
    setClickable(true)
  }

  async function onCardClick(game: MemoGame, index: number) {
    if (card1 === null) {
      setCard1(index)
    } else {
      setCard2(index)
      setClickable(false)
      if (cards[card1] === cards[index]) {
        await wait(0.25)
        const solvedWords = [...game.solvedWords, cards[card1]]
        game.solvedWords = [...solvedWords]
        if (solvedWords.length === difficultiesInfo[game.difficulty].words) {
          game.state = 'completed'
          stopwatch.pause()
          props.memoStore.gamesPlayed.push(game)
          setClickable(false)
          setCard1(null)
          setCard2(null)
          const cardsAnimDur = 1.5
          const cardAnimDur = 0.7
          cards.forEach((_, i) => {
            const cardEl = document.querySelector(`#card-${i}`)
            const solvedBg = cardEl ? cardEl.querySelector(`#solved-bg-${i}`) : undefined
            if (cardEl && solvedBg) {
              const delay = (cardsAnimDur - cardAnimDur) * (i / cards.length)
              animate(cardEl, { rotateY: '180deg' }, { delay, duration: cardAnimDur, ease: [0.3, 1, 0, 1] })
              animate(solvedBg, { opacity: 0 }, { delay, duration: cardAnimDur, ease: [0.3, 1, 0, 1] })
            }
          })
          await wait(0.3 + cardsAnimDur)
          setCards([])
          props.memoStore.currentGame = null
          stopwatch.stop()
        }
      } else {
        await wait(1)
      }
      setCard1(null)
      setCard2(null)
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
    <article {...attr} className={clsx(attr.className, 'grid grid-cols-[1fr,1fr] gap-x-12 max-md:grid-cols-1')}>
      <section className='flex w-full flex-col justify-self-center overflow-hidden'>
        <header className='hopper mb-4'>
          <div className='mx-auto mt-1 h-4 w-4/5 rounded-full bg-zinc-800 max-md:w-full'></div>
          <div className='mx-auto h-4 w-4/5 overflow-hidden rounded-full max-md:w-full'>
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
        <div about='game-board' className={clsx('mb-4 h-0 w-full grow duration-100 max-md:h-auto', memoSnap.currentGame?.state === 'paused' && 'opacity-50')}>
          <AnimatePresence>
            {memoSnap.currentGame ? (
              <motion.ul
                className='relative left-1/2 top-1/2 grid max-h-full max-w-full gap-1'
                style={{
                  translate: '-50% -50%',
                  aspectRatio: columns[memoSnap.currentGame.difficulty] / ((difficultiesInfo[memoSnap.currentGame.difficulty].words * 2) / columns[memoSnap.currentGame.difficulty]),
                  gridTemplateColumns: `repeat(${columns[memoSnap.currentGame.difficulty]}, minmax(0, 1fr))`,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { duration: 0.5, ease } }}
                exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
              >
                {cards.map((word, i) => {
                  const selected = i === card1 || i === card2
                  const solved = props.memoStore.currentGame!.solvedWords.includes(word)
                  return (
                    <li key={word + i} className='contents'>
                      <button
                        id={`card-${i}`}
                        disabled={!clickable}
                        onClick={() => onCardClick(props.memoStore.currentGame!, i)}
                        className={clsx('@container-size hopper bg-zinc-800 duration-200 [perspective:100px] [transform-style:preserve-3d]', selected && '!bg-zinc-700', selected || solved ? 'pointer-events-none [transform:rotateY(0deg)]' : '[transform:rotateY(180deg)]')}
                      >
                        <div className={'size-full place-self-center overflow-hidden'}>
                          <div id={`solved-bg-${i}`} className={clsx(solved ? 'scale-150 duration-500' : 'scale-0', 'h-full w-full rounded-full bg-pink-400 ease-out')} />
                        </div>
                        <span style={{ fontSize: `${50 / word.length}cqi` }} className={clsx('flex size-full items-center justify-center place-self-center stroke-zinc-500 [transform:translateZ(1rem)]', solved && '!text-zinc-900', selected && '!text-zinc-400 duration-1000')}>
                          {word}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </motion.ul>
            ) : (
              <motion.div style={{ translate: '-50% -50%' }} initial={{ scale: 0.5, opacity: 0 }} animate={{ opacity: 1, scale: 1, transition: { ease, duration: 1 } }} className='relative left-1/2 top-1/2 block aspect-square h-3/4 max-h-full max-w-full'>
                <TbGridPattern className='size-full stroke-zinc-800 stroke-[0.5]' />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <footer className='mb-8 flex w-fit items-center self-center max-md:w-full'>
          <div className='mr-12 flex items-center font-mono max-md:mr-auto'>
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
          <button disabled={!memoSnap.currentGame || memoSnap.currentGame.state === 'completed'} onClick={() => props.memoStore.currentGame && cancelGame(props.memoStore.currentGame)} className='rounded-md bg-zinc-800 text-zinc-400 duration-100 enabled:hover:text-zinc-200 disabled:opacity-50'>
            <TbHandStop className='size-12 p-3' />
          </button>
        </footer>
      </section>
      <section about='settings' className='@container/settings max-md:flex max-md:flex-col'>
        <section className='mb-6 max-md:order-2'>
          <h2 className='mb-4 font-display'>Сложность</h2>
          <menu className='flex w-full gap-4 max-md:flex-col max-md:gap-0'>
            {objectEntries(difficultiesInfo).map(([d, info]) => {
              const selected = props.memoStore.gameSettings.difficulty === d
              return (
                <li key={d} className='group contents'>
                  <button
                    disabled={selected}
                    onClick={() => (props.memoStore.gameSettings.difficulty = d)}
                    className={clsx(
                      'hopper h-20 max-w-40 flex-1 rounded-lg border-2 border-zinc-700 bg-zinc-800 duration-100 max-md:flex max-md:max-w-none max-md:items-center max-md:rounded-none max-md:px-3 max-md:py-1 max-md:group-first:rounded-t-lg max-md:group-last:rounded-b-lg',
                      selected ? 'opacity-100' : 'opacity-50',
                    )}
                  >
                    <info.icon className={clsx('size-8 duration-100 max-md:mr-2 md:ml-3 md:mt-2 md:self-start', selected ? 'scale-100' : 'scale-90')} />
                    <div className={clsx('max-md:mr-auto md:mx-3 md:mb-1 md:self-end md:justify-self-start')}>{info.name}</div>
                    <span className={clsx('text-xl md:mr-4 md:mt-2 md:justify-self-end')}>{info.words}</span>
                  </button>
                </li>
              )
            })}
          </menu>
        </section>
        <section className='mb-8 max-md:order-3'>
          <h2 className='mb-4 font-display'>Слова</h2>
          <section className='grid h-72 grid-cols-[3fr,2fr] grid-rows-[auto,1fr] overflow-hidden rounded-lg border-2 border-zinc-800 max-md:h-auto max-md:grid-cols-1'>
            <header className='flex gap-5'>
              <h3 className='self-center py-1.5 pl-4 max-md:text-lg'>
                <span className={clsx('duration-100', memoSnap.gameSettings.words.length / difficultiesInfo[memoSnap.gameSettings.difficulty].words < 1 ? 'text-zinc-500' : 'text-zinc-200')}>{memoSnap.gameSettings.words.length}</span>
                <span className='text-zinc-500'>/</span>
                {difficultiesInfo[memoSnap.gameSettings.difficulty].words}
              </h3>
              <Tooltip content='Если слов будет больше, чем нужно, они будут выбираться случайным образом.'>
                <button className='cursor-default'>
                  <TbInfoCircle className='size-4 stroke-zinc-400' />
                </button>
              </Tooltip>
              <button onClick={() => (props.memoStore.gameSettings.words = [])} className='ml-auto flex aspect-square h-full items-center justify-center self-center text-zinc-400 duration-100 hover:text-zinc-200'>
                <TbEraser className='size-5 max-md:size-6' />
              </button>
            </header>
            <header className='border-l-2 border-zinc-800 max-md:row-start-3 max-md:border-l-0'>
              <menu className='flex h-full'>
                {objectEntries(suggestedWordsGroups).map(([group, info]) => (
                  <li className='contents' key={group}>
                    <button onClick={() => setSuggestedWordsGroup(group)} className={clsx('flex flex-1 items-center justify-center max-md:py-2', suggestedWordsGroup === group ? 'bg-zinc-800' : '')}>
                      <info.icon className='size-5 max-md:size-6' />
                    </button>
                  </li>
                ))}
              </menu>
            </header>
            <div className='px-3 py-2 max-md:h-52'>
              <menu about='selected-words' className='flex flex-wrap items-center self-start'>
                {memoSnap.gameSettings.words.map((w) => (
                  <li key={w} className='contents'>
                    <button onClick={() => (props.memoStore.gameSettings.words = props.memoStore.gameSettings.words.filter((word) => word !== w))} className={clsx('px-2 py-1 text-2xl duration-100', w === wordToAdd ? 'text-red-500 hover:opacity-80' : 'hover:text-zinc-400')}>
                      {w}
                    </button>
                  </li>
                ))}
                <li className='hopper mx-2 my-[calc(theme(padding.1)-2px)] rounded-lg border-2 border-zinc-800 has-[input:hover]:border-zinc-700'>
                  <input spellCheck={false} ref={wordInputRef} onChange={(e) => setWordToAdd(e.target.value.trim())} type='text' className='w-[8ch] rounded-[calc(theme(borderRadius.lg)-2px)] bg-transparent pl-2 pr-9 text-center text-2xl text-zinc-500 duration-100  focus:text-zinc-200' />
                  <button
                    disabled={!wordToAdd || memoSnap.gameSettings.words.includes(wordToAdd)}
                    onClick={() => {
                      wordInputRef.current.focus()
                      if (wordToAdd && !memoSnap.gameSettings.words.includes(wordToAdd)) {
                        wordInputRef.current.value = ''
                        props.memoStore.gameSettings.words.push(wordToAdd)
                        setWordToAdd('')
                      }
                    }}
                    className='flex aspect-square grow items-center justify-center justify-self-end rounded-r-[calc(theme(borderRadius.lg)-2px)] bg-zinc-800 px-1 duration-100 enabled:hover:bg-zinc-700 disabled:opacity-50'
                  >
                    <TbPlus className='size-5' />
                  </button>
                </li>
              </menu>
            </div>
            <menu className='flex flex-col overflow-y-auto border-l-2 border-zinc-800 max-md:h-52 max-md:border-l-0'>
              {suggestedWordsGroups[suggestedWordsGroup]
                .get()
                .filter((w) => /\p{Script=Han}/gu.test(w))
                .toReversed()
                .map((w, i) => (
                  <li className='flex ' key={i}>
                    <button disabled={memoSnap.gameSettings.words.includes(w)} onClick={() => props.memoStore.gameSettings.words.push(w)} className='grow py-0.5 pl-3 text-left text-xl text-zinc-400 duration-100 enabled:hover:text-zinc-200 disabled:opacity-50 max-md:text-3xl'>
                      {w}
                    </button>
                    <a target='_blank' href={route(`/search/${w}`)} className='flex items-center justify-center px-2 text-zinc-400 duration-100 hover:text-zinc-200'>
                      <TbExternalLink className='size-5 max-md:size-6' />
                    </a>
                  </li>
                ))}
            </menu>
          </section>
        </section>
        <section className='flex gap-4 @max-md/settings:order-1 @max-md/settings:grid @max-md/settings:grid-cols-[1fr,auto] @max-md/settings:gap-2 max-md:mb-8'>
          <button
            disabled={!startButtonEnabled}
            onClick={() =>
              startGame({
                difficulty: props.memoStore.gameSettings.difficulty,
                words: props.memoStore.gameSettings.words,
              })
            }
            className='origin-left rounded-lg bg-zinc-800 px-6 py-1.5 text-lg text-zinc-200 duration-100 enabled:hover:bg-zinc-700 disabled:opacity-50 @max-md/settings:col-span-2'
          >
            Начать
          </button>
          <Stats props={{ memoStore: props.memoStore, startGame }} className='ml-auto @max-md/settings:ml-0' />
          <Help />
        </section>
      </section>
    </article>
  )
}
