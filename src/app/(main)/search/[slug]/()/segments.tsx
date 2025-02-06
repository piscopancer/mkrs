'use client'

import { buildBkrsUrl, type ChLongSegments as SegmentsType } from '@/bkrs'
import { Tooltip } from '@/components/tooltip'
import { copy } from '@/copying'
import { searchStore } from '@/search'
import { generalStore } from '@/stores/general'
import { stringToReact } from '@/utils'
import clsx from 'clsx'
import { animate, circInOut, motion, transform, useMotionValue, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { TbArrowUp, TbChevronLeft, TbChevronRight, TbCopy, TbInfoCircle } from 'react-icons/tb'
import { zinc } from 'tailwindcss/colors'
import Header from './header'

const cardRatio = 3 / 4

// TODO: bug / if scrolling 1 card to the right, then opening settings dropdown the scrolling area will offset by 1 to the right, as if card #1 on which we stopped is now the starting point, also making it possible to go 1 more card to the left. Solution: debug values
export default function ChLongSegments({ segments, ...compProps }: React.ComponentProps<'section'> & { segments: SegmentsType }) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null!)
  const scrollRef = useRef<HTMLDivElement>(null!)
  const [cardWidth, setCardWidth] = useState(-1)
  const xMv = useMotionValue(0)
  const progressMv = useTransform(xMv, [0, -cardWidth * segments.cards.length], [0, 1], { clamp: false })
  const wordsScrolledMv = useTransform(progressMv, [0, 1], [0.5, segments.cards.length - 0.5], { clamp: false })
  const scrollMult = cardWidth / 2
  const [collapsed, setCollapsed] = useState(false)
  const copyModeSnap = generalStore.copyMode.use()

  useEffect(() => {
    if (!collapsed) {
      setCardWidth(scrollRef.current.getBoundingClientRect().height * cardRatio)
    }
  }, [collapsed])

  function getCurrentCardIndex(): number {
    return Math.round(wordsScrolledMv.get() - 0.5)
  }

  function getCurrentCard() {
    return segments.cards[getCurrentCardIndex()]
  }

  function scrollToNearestCard() {
    const nearestIndex = getCurrentCardIndex()
    scrollToCard(nearestIndex)
  }

  function scrollToCard(index: number) {
    const wordsScrolledTarget = index + 0.5
    const progressTarget = transform(wordsScrolledTarget, [0.5, segments.cards.length - 0.5], [0, 1])
    const xTarget = transform(progressTarget, [0, 1], [0, -cardWidth * segments.cards.length])
    animate(xMv, xTarget, { duration: 0.2 })
  }

  function controlClicked(moveBy: -1 | 1) {
    const currentCardIndex = getCurrentCardIndex()
    switch (moveBy) {
      case -1:
        if (currentCardIndex === 0) {
          scrollToCard(segments.cards.length - 1)
        } else scrollToCard(currentCardIndex - 1)
        break
      case 1:
        if (currentCardIndex === segments.cards.length - 1) {
          scrollToCard(0)
        } else scrollToCard(currentCardIndex + 1)
        break
    }
  }

  return (
    <section {...compProps} className={clsx('relative', compProps.className)}>
      <button onClick={() => setCollapsed((prev) => !prev)} className={clsx('w-full cursor-default text-left', collapsed ? '' : 'mb-6')}>
        <Header text='Пословно' collapsed={collapsed} />
      </button>
      <div className={clsx(collapsed && 'hidden')}>
        {/* refs */}
        <div className='mb-4'>
          <ul className='flex justify-center text-lg'>
            {segments.refs.map((ref, i) => {
              const cardIndex = ref.forCards[0]
              return (
                <motion.li
                  style={{
                    opacity: useTransform(
                      wordsScrolledMv,
                      ref.forCards.length === 2
                        ? [
                            //
                            cardIndex - 1,
                            cardIndex + 0.5,
                            cardIndex + 1.5,
                            cardIndex + 3,
                          ]
                        : [
                            //
                            cardIndex - 1,
                            cardIndex + 0.5,
                            cardIndex + 2,
                          ],
                      ref.forCards.length === 2 ? [0.5, 1, 1, 0.5] : [0.5, 1, 0.5],
                    ),
                  }}
                  key={i}
                >
                  <button
                    onClick={() => {
                      scrollToCard(cardIndex)
                    }}
                  >
                    {ref.ch}
                  </button>
                </motion.li>
              )
            })}
          </ul>
        </div>
        {/* menu */}
        <motion.menu initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: cardWidth + 'px' }} className='mx-auto mb-4 flex'>
          <Tooltip content='Копировать в поиск'>
            <motion.button
              onClick={() => {
                searchStore.search.set(getCurrentCard().ch)
                searchStore.focused.set(true)
                searchStore.showSuggestions.set(true)
              }}
              className='flex flex-1 items-center justify-center rounded-lg py-2 max-md:active:bg-zinc-800 md:hover:bg-zinc-800'
            >
              <TbArrowUp className='stroke-zinc-200' />
            </motion.button>
          </Tooltip>
          <div className='my-auto h-4 border-r border-zinc-800' />
          <Tooltip content='Копировать'>
            <motion.button
              onClick={() => {
                const { ch, py, ru } = getCurrentCard()
                const ruTextContent = new DOMParser().parseFromString(ru, 'text/html').body.textContent ?? ''
                copy(copyModeSnap, {
                  ch: { ch },
                  full: { ch, py, ru: ruTextContent },
                })
              }}
              className='flex flex-[2] items-center justify-center rounded-lg py-2 max-md:active:bg-zinc-800 md:hover:bg-zinc-800'
            >
              <TbCopy className='stroke-zinc-200' />
            </motion.button>
          </Tooltip>
          <div className='my-auto h-4 border-r border-zinc-800' />
          <Tooltip content='Открыть на 大БКРС'>
            <button
              onClick={() => {
                window.open(buildBkrsUrl(getCurrentCard().ch))
              }}
              className='flex-1 rounded-lg py-2 text-center text-sm font-light text-zinc-200 max-md:active:bg-zinc-800 md:hover:bg-zinc-800'
            >
              大
            </button>
          </Tooltip>
        </motion.menu>
        {/* cards */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} ref={containerRef} className='relative mb-4'>
          <motion.aside
            onDoubleClick={() => {
              const card = segments.cards[getCurrentCardIndex()]
              const trash = !(card.ch && card.py)
              if (trash) return
              router.push(`/search/${card.ch}`)
            }}
            ref={scrollRef}
            drag='x'
            style={{
              x: xMv,
              width: `calc(100% + ${cardWidth * segments.cards.length}px)`,
            }}
            onClick={() => {}}
            dragTransition={{
              power: 0.3,
              timeConstant: 150,
            }}
            onDragTransitionEnd={scrollToNearestCard}
            onDragEnd={(e, { velocity }) => {
              if (Math.abs(velocity.x) < 250) {
                scrollToNearestCard()
              }
            }}
            dragConstraints={containerRef}
            className='absolute left-0 top-0 z-[1] h-full'
          />
          {/* cards */}
          <ul className='relative z-[0] mx-auto flex h-64 justify-center overflow-visible [perspective:1000px] [transform-style:preserve-3d]' draggable={false}>
            {segments.cards.map((card, i, arr) => {
              const trash = !(card.ch && card.py)
              return (
                <motion.li
                  style={{
                    zIndex: useTransform(wordsScrolledMv, (scr) => (scr > i ? 0 : -arr.length - i + 1)),
                    x: useTransform(
                      wordsScrolledMv,
                      [i, i + 1],
                      [
                        scrollMult,
                        //
                        -scrollMult,
                      ],
                      { clamp: false },
                    ),
                    rotateY: useTransform(
                      wordsScrolledMv,
                      [i, i + 1],
                      [
                        '-20deg',
                        //
                        '20deg',
                      ],
                    ),
                    translateZ: useTransform(
                      wordsScrolledMv,
                      [i, i + 0.5, i + 1],
                      [
                        '10px',
                        '0px',
                        //
                        '10px',
                      ],
                      { clamp: false },
                    ),
                  }}
                  key={i}
                  className='absolute flex h-full w-px justify-center'
                >
                  <motion.article
                    style={{
                      opacity: useTransform(
                        wordsScrolledMv,
                        [i - 1, i + 0.5, i + 2],
                        trash
                          ? [
                              //
                              0.5, 0.5, 0.5,
                            ]
                          : [
                              //
                              0.8, 1, 0.8,
                            ],
                        { ease: circInOut },
                      ),
                      scale: useTransform(
                        wordsScrolledMv,
                        [i - 1, i + 0.5, i + 2],
                        [
                          //
                          0.95, 1, 0.95,
                        ],
                        { ease: circInOut },
                      ),
                      x: useTransform(
                        wordsScrolledMv,
                        [i - 1.5, i + 0.5, i + 2.5],
                        [
                          //
                          -scrollMult * 2,
                          0,
                          scrollMult * 2,
                        ],
                        { ease: (x) => x },
                      ),
                      backgroundColor: useTransform(
                        wordsScrolledMv,
                        [i - 1.5, i + 0.5, i + 2.5],
                        [
                          //
                          zinc[900],
                          trash ? zinc[900] : zinc[800],
                          zinc[900],
                        ],
                        { ease: (x) => x },
                      ),
                      aspectRatio: cardRatio,
                    }}
                    className='h-full rounded-xl border border-zinc-800 pt-6'
                  >
                    <h2 className='mb-3 text-center text-4xl'>{card.ch}</h2>
                    <p className='mb-3 text-center font-mono text-zinc-500'>{card.py}</p>
                    {card.ru && <div className='line-clamp-5 px-4 text-center text-xs'>{stringToReact(card.ru)}</div>}
                  </motion.article>
                </motion.li>
              )
            })}
          </ul>
          {/* controls */}
          <button onClick={() => controlClicked(-1)} className='absolute left-0 top-1/2 z-[1] flex size-16 -translate-y-1/2 items-center justify-center rounded-full border-2 border-zinc-800 bg-zinc-900/80 duration-100 active:scale-90'>
            <TbChevronLeft className='size-8' />
          </button>
          <button onClick={() => controlClicked(1)} className='absolute right-0 top-1/2 z-[1] flex size-16 -translate-y-1/2 items-center justify-center rounded-full border-2 border-zinc-800 bg-zinc-900/80 duration-100 active:scale-90'>
            <TbChevronRight className='size-8' />
          </button>
        </motion.div>
        {/* hint */}
        <aside className='pointer-events-none mx-auto w-fit'>
          <p className='inline-flex text-xs text-zinc-500'>
            <TbInfoCircle className='mr-1 inline self-center' /> Чтобы открыть, нажмите дважды
          </p>
        </aside>
      </div>
    </section>
  )
}
