'use client'

import { difficultyInfo, memoStore, type MemoGame } from '@/memo-game'
import { TComponent, getShuffledArray } from '@/utils'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'

const TEST_WORDS = ['🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍒']

const columns = {
  easy: 4,
  hard: 6,
  medium: 8,
} as const satisfies Record<keyof typeof difficultyInfo, number>

export default function MemoGame(props: TComponent<'article', {}>) {
  const memoSnap = useSnapshot(memoStore)
  const [cards, setCards] = useState<string[]>([])
  const [card1, setCard1] = useState<number | undefined>()
  const [card2, setCard2] = useState<number | undefined>()
  const [clickable, setClickable] = useState(true)

  function start(game: Pick<MemoGame, 'difficulty' | 'words'>) {
    const seed = Math.floor(Math.random() * 100)
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

  function onCardClick(index: number) {
    if (card1 === undefined) {
      setCard1(index)
      return
    }
    setCard2(index)
  }

  useEffect(() => {
    if (memoSnap.currentGame) {
      setCards(getShuffledArray([...memoSnap.currentGame.words, ...memoSnap.currentGame.words], memoSnap.currentGame.seed))
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
    <article {...props} className={clsx(props.className, 'grid grid-cols-[auto,1fr]')}>
      <div className='flex flex-col'>
        <div className='h-12 rounded-lg bg-zinc-700'></div>
        {memoSnap.currentGame ? (
          <ul
            style={{
              gridTemplateColumns: `repeat(${columns[memoSnap.currentGame.difficulty]}, minmax(0, 1fr))`,
            }}
            className='grid'
          >
            {cards.map((word, i) => (
              <li key={word + i}>
                <button>{word}</button>
              </li>
            ))}
          </ul>
        ) : (
          <div className='aspect-square grow bg-red-500'></div>
        )}
      </div>
      <div>
        <button onClick={() => start({ difficulty: 'easy', words: TEST_WORDS })}>start</button>
      </div>
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
