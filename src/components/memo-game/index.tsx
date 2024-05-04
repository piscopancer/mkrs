'use client'

import { difficultiesInfo, memoStore, type MemoGame } from '@/memo-game'
import { recentStore } from '@/recent'
import { savedStore } from '@/saved'
import { TComponent, clone, getShuffledArray, objectEntries, randomItemsFromArray, wait } from '@/utils'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { IconType } from 'react-icons'
import { TbClockPlay, TbDeviceFloppy, TbEraser, TbExternalLink, TbHandStop, TbHistory, TbInfoCircle, TbPlayerPause, TbPlayerPlay } from 'react-icons/tb'
import { useSnapshot } from 'valtio'
import { Tooltip } from '../tooltip'

function transformTime(seconds: number) {
  const min = Math.floor(seconds / 60)
  const sec = seconds - min * 60
  return `${min}:${sec > 9 ? sec : `0${sec}`}`
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

export default function MemoGame(props: TComponent<'article', {}>) {
  const memoSnap = useSnapshot(memoStore)
  const [wordsGroup, setWordsGroup] = useState<keyof typeof wordsGroups>('recent')
  const [cards, setCards] = useState<string[]>([])
  const [card1, setCard1] = useState<number | undefined>()
  const [card2, setCard2] = useState<number | undefined>()
  const [clickable, setClickable] = useState(true)

  function startGame(_game: Pick<MemoGame, 'difficulty' | 'words'>) {
    const seed = Math.floor(Math.random() * 100)
    const game = clone(_game)
    const words = game.words.length > difficultiesInfo[game.difficulty].words ? randomItemsFromArray(game.words, difficultiesInfo[game.difficulty].words) : game.words
    game.words = words
    memoStore.currentGame = {
      ...game,
      id: crypto.randomUUID(),
      seed,
      time: 0,
      state: 'active',
      solvedWords: [],
    }
    setCards(getShuffledArray([...words, ...words], seed))
  }

  async function pauseGame(game: MemoGame) {
    game.state = 'paused'
    // pause timer
  }

  async function resumeGame(game: MemoGame) {
    game.state = 'active'
    // resume timer
  }

  async function stopGame() {
    memoStore.currentGame = undefined
    setCard1(undefined)
    setCard2(undefined)
    setClickable(false)
    await wait(0.2)
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
        game.solvedWords.push(cards[card1])
      } else {
        await wait(1)
      }
      setCard2(undefined)
      setCard1(undefined)
      setClickable(true)
    }
  }

  useEffect(() => {
    if (memoStore.currentGame) {
      setCards(getShuffledArray([...memoStore.currentGame.words, ...memoStore.currentGame.words], memoStore.currentGame.seed))
    }
  }, [memoSnap.currentGame])

  // async function restart() {
  //   setClickable(false)
  //   setSolvedCards([])
  //   setCard1(undefined)
  //   setCard2(undefined)
  //   await wait(0.2)
  //   setCards(prepareWords(props.cards))
  //   setClickable(true)
  // }

  return (
    <article {...props} className={clsx(props.className, 'grid grid-cols-[1fr,1fr] gap-12')}>
      <section className='flex w-full flex-col justify-self-center'>
        <header className='hopper mb-4'>
          <div className='mx-auto mt-1 h-4 w-4/5 rounded-full bg-zinc-800'></div>
          <div className='mx-auto h-4 w-4/5 overflow-hidden rounded-full'>
            <motion.div
              animate={{
                scaleX: memoSnap.currentGame ? memoSnap.currentGame.solvedWords.length / difficultiesInfo[memoSnap.currentGame.difficulty].words : 0,
                transition: { ease: [0.3, 1, 0, 1] },
              }}
              className='h-full origin-left bg-pink-500'
            ></motion.div>
          </div>
        </header>
        <div about='game-board' className='mb-4 flex w-full grow'>
          <div className='grow'>
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
                  const solved = memoStore.currentGame!.solvedWords.includes(word)
                  return (
                    <li key={word + i} className='contents'>
                      <button
                        disabled={!clickable}
                        onClick={() => onCardClick(memoStore.currentGame!, i)}
                        className={clsx('hopper bg-zinc-800 duration-200 [perspective:100px] [transform-style:preserve-3d]', selected && '!bg-zinc-700', selected || solved ? 'pointer-events-none [transform:rotateY(0deg)]' : '[transform:rotateY(180deg)]')}
                      >
                        <div className={clsx('hopper size-full place-self-center overflow-hidden')}>
                          <div className={clsx(solved ? 'scale-150 duration-500' : 'scale-0', 'h-full w-full rounded-full bg-pink-400 ease-out')} />
                        </div>
                        <span className={clsx('flex size-full items-center justify-center place-self-center stroke-zinc-500 text-4xl [transform:translateZ(1rem)]', solved && '!text-zinc-900', selected && '!text-zinc-400 duration-1000')}>{word}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className='aspect-square h-[100cqmin] bg-zinc-800/50'></div>
            )}
          </div>
        </div>
        <footer className='mb-8 flex w-fit items-center self-center'>
          <p className='mr-12 flex items-center'>
            <TbClockPlay className='mr-3 size-6' />
            {transformTime(memoSnap.currentGame?.time ?? 0)}
          </p>
          <button
            disabled={!memoSnap.currentGame}
            onClick={() => {
              if (!memoStore.currentGame) return
              if (memoStore.currentGame.state === 'active') {
                pauseGame(memoStore.currentGame)
              } else if (memoStore.currentGame.state === 'paused') {
                resumeGame(memoStore.currentGame)
              }
            }}
            className='mr-2 rounded-md bg-zinc-800 text-zinc-400 duration-100 enabled:hover:text-zinc-200 disabled:opacity-50'
          >
            {memoSnap.currentGame?.state === 'active' ? <TbPlayerPause className='size-12 p-3' /> : <TbPlayerPlay className='size-12 p-3' />}
          </button>
          <button disabled={!!!memoSnap.currentGame} onClick={stopGame} className='rounded-md bg-zinc-800 text-zinc-400 duration-100 enabled:hover:text-zinc-200 disabled:opacity-50'>
            <TbHandStop className='size-12 p-3' />
          </button>
        </footer>
      </section>
      <section about='game-settings'>
        <h2 className='mb-4 font-display'>Сложность</h2>
        <menu className='mb-6 flex w-full gap-4'>
          {objectEntries(difficultiesInfo).map(([d, info]) => {
            const selected = memoStore.gameSettings.difficulty === d
            return (
              <li key={d} className='contents'>
                <button disabled={selected} onClick={() => (memoStore.gameSettings.difficulty = d)} className={clsx('hopper h-20 max-w-40 flex-1 rounded-lg border-2 border-zinc-700 bg-zinc-800 duration-100', selected ? 'opacity-100' : 'opacity-50')}>
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
          <header className='flex gap-5 border-r-2 border-zinc-800'>
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
            <button onClick={() => (memoStore.gameSettings.words = [])} className='ml-auto flex aspect-square h-full items-center justify-center self-center text-zinc-400 duration-100 hover:text-zinc-200'>
              <TbEraser className='size-5' />
            </button>
          </header>
          <header>
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
          <menu className='flex h-auto flex-wrap gap-4 border-r-2 border-zinc-800 px-3 py-2'>
            {memoSnap.gameSettings.words.map((w) => (
              <li key={w} className='contents'>
                <button onClick={() => (memoStore.gameSettings.words = memoStore.gameSettings.words.filter((word) => word !== w))} className='text-2xl'>
                  {w}
                </button>
              </li>
            ))}
          </menu>
          <menu className='flex flex-col overflow-y-auto'>
            {wordsGroups[wordsGroup]
              .get()
              .toReversed()
              .map((w) => (
                <li className='flex' key={w}>
                  <button disabled={memoSnap.gameSettings.words.includes(w)} onClick={() => memoStore.gameSettings.words.push(w)} className='grow py-0.5 pl-3 text-left text-2xl text-zinc-400 duration-100 enabled:hover:text-zinc-200 disabled:opacity-50'>
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
        <button
          disabled={memoSnap.gameSettings.words.length < difficultiesInfo[memoSnap.gameSettings.difficulty].words}
          onClick={() => startGame(memoStore.gameSettings)}
          className='rounded-lg bg-zinc-800 px-6 py-1.5 text-lg duration-100 enabled:text-zinc-200 enabled:hover:bg-zinc-700 disabled:opacity-50'
        >
          Начать
        </button>
      </section>
    </article>
  )
}
