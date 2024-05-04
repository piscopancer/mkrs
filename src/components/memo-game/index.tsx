'use client'

import { difficultiesInfo, memoStore, type MemoGame } from '@/memo-game'
import { recentStore } from '@/recent'
import { savedStore } from '@/saved'
import { TComponent, clone, getShuffledArray, objectEntries } from '@/utils'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { IconType } from 'react-icons'
import { TbDeviceFloppy, TbEraser, TbExternalLink, TbHandStop, TbHistory } from 'react-icons/tb'
import { useSnapshot } from 'valtio'

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
    memoStore.currentGame = {
      ...game,
      id: crypto.randomUUID(),
      seed,
      time: 0,
      state: 'active',
      solvedWords: [],
    }
    setCards(getShuffledArray([...game.words, ...game.words], seed))
  }

  function stopGame() {
    memoStore.currentGame = undefined
    setCards([])
  }

  function onCardClick(index: number) {
    if (card1 === undefined) {
      setCard1(index)
      return
    }
    setCard2(index)
  }

  useEffect(() => {
    if (memoStore.currentGame) {
      setCards(getShuffledArray([...memoStore.currentGame.words, ...memoStore.currentGame.words], memoStore.currentGame.seed))
    }
  }, [memoSnap.currentGame])

  // useEffect(() => {
  //   checkMatch()
  // }, [card2])

  // async function checkMatch() {
  //   if (card1 === undefined || card2 === undefined) return
  //   setClickable(false)
  //   if (cards[card1].text === cards[card2].text) {
  //     await wait(0.25)
  //     setSolvedCards([...solvedWords, cards[card1].text])
  //   } else {
  //     await wait(1)
  //   }
  //   setCard2(undefined)
  //   setCard1(undefined)
  //   setClickable(true)
  // }

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
    <article {...props} className={clsx(props.className, 'grid grid-cols-[2fr,2fr] gap-12')}>
      <section className='flex flex-col'>
        <header className='h-12 rounded-lg bg-zinc-700'></header>
        {memoSnap.currentGame ? (
          <ul
            style={{
              gridTemplateColumns: `repeat(${columns[memoSnap.currentGame.difficulty]}, minmax(0, 1fr))`,
            }}
            className='my-auto grid aspect-square w-full max-w-[80vmin] self-center'
          >
            {cards.map((word, i) => (
              <li key={word + i} className='contents'>
                <button className='flex size-full items-center justify-center'>{word}</button>
              </li>
            ))}
          </ul>
        ) : (
          <div className='my-auto aspect-square w-full max-w-[80vmin] self-center rounded-xl bg-zinc-800'></div>
        )}
        <footer>
          <button disabled={!!!memoSnap.currentGame} onClick={stopGame} className='rounded-md bg-zinc-800 text-zinc-400 duration-100 enabled:hover:text-zinc-200 disabled:opacity-50'>
            <TbHandStop className='size-12 p-3' />
          </button>
        </footer>
      </section>
      <section>
        <h2 className='mb-4 font-display'>Сложность</h2>
        <menu className='mb-6 flex w-full gap-4'>
          {objectEntries(difficultiesInfo).map(([d, info]) => {
            const selected = memoStore.gameSettings.difficulty === d
            return (
              <li key={d} className='contents'>
                <button onClick={() => (memoStore.gameSettings.difficulty = d)} className={clsx('hopper aspect-[5/3] max-w-40 flex-1 rounded-lg duration-100', selected ? 'bg-zinc-700' : 'bg-zinc-800')}>
                  <span className={clsx('mr-4 mt-2 justify-self-end text-xl', selected ? 'text-zinc-200' : 'text-zinc-400')}>{info.words}</span>
                  <div className={clsx('mb-1 ml-3 self-end justify-self-start', selected ? 'text-zinc-200' : 'text-zinc-400')}>{info.name}</div>
                  <info.icon className={clsx('ml-3 mt-2 size-10 self-start duration-100', selected ? 'fill-pink-500 saturate-100' : 'saturate-0')} />
                </button>
              </li>
            )
          })}
        </menu>
        <h2 className='mb-4 font-display'>Слова</h2>
        <section className='grid h-72 grid-cols-[3fr,2fr] grid-rows-[auto,1fr] overflow-hidden rounded-lg border-2 border-zinc-800'>
          <header className='flex gap-5 border-r-2 border-zinc-800'>
            <h2 className='self-center py-1.5 pl-4'>
              <span className={clsx('duration-100', memoSnap.gameSettings.words.length / difficultiesInfo[memoSnap.gameSettings.difficulty].words < 1 ? 'text-zinc-500' : 'text-zinc-200')}>{memoSnap.gameSettings.words.length}</span>
              <span className='text-zinc-500'>/</span>
              {difficultiesInfo[memoSnap.gameSettings.difficulty].words}
            </h2>
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
            {wordsGroups[wordsGroup].get().map((w) => (
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
        <button onClick={() => startGame(memoStore.gameSettings)}>Старт</button>
      </section>
    </article>
  )

  // return (
  //   <article>
  //     <header className='relative flex items-center rounded-2xl'>
  //       <TbDeviceGamepad className='h-8 w-8 stroke-zinc-500 max-md:h-6 max-md:w-6' />
  //       <p className='ml-3 text-zinc-400 max-md:text-sm'>
  //         <b>Memo</b> <span className='italic text-zinc-500'>/** не путать с React.memo */</span>
  //       </p>
  //       <Tooltip content={'Начать заново'}>
  //         <button onClick={restart} className='ml-auto h-10 w-10 shrink-0 rounded-full p-2 hover:bg-zinc-800'>
  //           <TbRefresh className='h-full w-full stroke-zinc-600' />
  //         </button>
  //       </Tooltip>
  //       <Tooltip content={'Завершите игру, чтобы увидеть полный стек 🤗'}>
  //         <button className='ml-3 aspect-square h-10 shrink-0 cursor-default p-2 max-md:hidden'>
  //           <TbInfoSquareRounded className='h-full w-full stroke-zinc-600' />
  //         </button>
  //       </Tooltip>
  //     </header>
  //     <ul className='mt-4 grid grid-cols-8 gap-1 overflow-hidden rounded-2xl border-[0.25rem] border-zinc-900 bg-zinc-900 max-md:grid-cols-4'>
  //       {cards.length === 0
  //         ? [...props.cards, ...props.cards].map((_, i) => <div key={i} className='aspect-square bg-zinc-800/50' />)
  //         : cards.map((card, i) => {
  //             const selected = i === card1 || i === card2
  //             const solved = solvedCards.includes(card.text)
  //             return (
  //               <button
  //                 disabled={!clickable}
  //                 key={i}
  //                 onClick={() => onCardClick(i)}
  //                 className={clsx(selected && '!bg-zinc-700', selected || solved ? 'pointer-events-none [transform:rotateY(0deg)]' : '[transform:rotateY(180deg)]', 'grid-stack grid aspect-square bg-zinc-800 duration-200 [perspective:100px] [transform-style:preserve-3d]')}
  //               >
  //                 <div className={clsx('stack h-full w-full place-self-center overflow-hidden')}>
  //                   <div className={clsx(solved ? 'scale-150 duration-500' : 'scale-0', 'bg-accent h-full w-full rounded-full ease-out')} />
  //                 </div>
  //                 <p className={clsx(solved && '!text-zinc-900', selected && '!text-zinc-400 duration-1000', 'stack h-8 w-8 place-self-center stroke-zinc-500 [transform:translateZ(1rem)]')}>{card.text}</p>
  //               </button>
  //             )
  //           })}
  //     </ul>
  //     <p className='my-4 font-medium text-zinc-500 max-md:my-2 max-md:text-sm'>
  //       Решено{' '}
  //       <span className='ml-1 text-xl max-md:text-lg'>
  //         <span className={clsx(solved ? 'text-accent' : 'text-zinc-400', 'font-bold')}>{solvedCards.length}</span>/{props.cards.length}
  //       </span>
  //     </p>
  //     <ul className='flex flex-wrap gap-3 max-md:gap-2'>
  //       {solvedCards
  //         .map((text) => props.cards.find((card) => card.text === text))
  //         .map((card) => {
  //           if (!card) return
  //           return (
  //             <motion.li initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className='flex items-center rounded-xl bg-zinc-800 px-4 py-2 max-md:px-2 max-md:py-1'>
  //               <p className='ml-3 text-zinc-300 max-md:ml-2 max-md:text-sm'>{card.text}</p>
  //             </motion.li>
  //           )
  //         })}
  //     </ul>
  //   </article>
  // )
}
