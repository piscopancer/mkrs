'use client'

import { Tooltip } from '@/components/tooltip'
import { stringToReact } from '@/utils'
import { animate, circInOut, motion, transform, useMotionValue, useTransform } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { TbArrowUp, TbChevronLeft, TbChevronRight, TbCopy } from 'react-icons/tb'
import { zinc } from 'tailwindcss/colors'

const res = {
  refs: [
    {
      ch: '钢',
      forCards: [0],
    },
    {
      ch: '琴',
      forCards: [0],
    },
    {
      ch: '龙',
      forCards: [1],
    },
    {
      ch: '：',
      forCards: [2],
    },
    {
      ch: '我',
      forCards: [3],
    },
    {
      ch: '一',
      forCards: [4],
    },
    {
      ch: '出',
      forCards: [4, 5],
    },
    {
      ch: '来',
      forCards: [5],
    },
    {
      ch: '就',
      forCards: [6],
    },
    {
      ch: '分',
      forCards: [7],
    },
    {
      ch: '解',
      forCards: [7],
    },
    {
      ch: '了',
      forCards: [8],
    },
    {
      ch: '健',
      forCards: [9],
    },
    {
      ch: '康',
      forCards: [9],
    },
    {
      ch: '检',
      forCards: [9],
    },
    {
      ch: '查',
      forCards: [9],
    },
  ],
  cards: [
    {
      ch: '钢琴',
      py: 'gāngqín',
      ru: '<div>пианино, рояль, фортепиано</div>\n',
      pos: [0, 1],
    },
    {
      ch: '龙',
      py: 'lóng',
      ru: '<div><span class="green"></span></div>\n<div>1) дракон</div>\n<div>2) императорский</div>\n',
      pos: [2],
    },
    {
      ch: '：',
      py: '',
      ru: '',
      pos: [3],
    },
    {
      ch: '我',
      py: 'wǒ',
      ru: '<div>1) я; мой</div>\n<div>2) мы; наш (<i>о коллективе, стране</i>)</div>\n<div>3) сам; самоличный, частный, личный</div>\n',
      pos: [4],
    },
    {
      ch: '一出',
      py: 'yīchū',
      ru: '<div>1) акт (действие) пьесы (<i class="green">также</i>—一出儿 <b>yīchūr</b>)</div>\n<div>2) раз, разок (<span class="green"><i>напр. </i></span><i>ругнуть, ударить, <span class="green">также</span> </i>—一出子 <b>yīchūzi</b>)</div>\n',
      pos: [5, 6],
    },
    {
      ch: '出来',
      py: 'chūlái',
      ru: '<div class="not_full"><div class="m2">1) выходить наружу; восходить (<i>о солнце</i>)</div>\n<div class="m2">2) вылезать; вылезай!</div>\n<div class="m2">3) вообще, в общем, в целом</div>\n<div><b>-chūlai, -chūlái</b></div>\n<div class="m2"><i>глагольный суффикс, модификатор результативных глаголов, обозначающий</i></div> <div class="hidden too_long td_word_hover">\n<div class="m2">а) <i>при глаголах, выражающих перемещение в пространстве, </i>— <i>направление действия изнутри наружу и к говорящему лицу</i></div>\n<div class="m2">б) <i>при прочих глаголах </i>— <i>создание, обнаружение или появление чего-л</i></div>\n</div> <a class="more_link pt10 link_show gray" href="slovo.php?ch=%E5%87%BA%E6%9D%A5">全词 &gt;&gt;</a></div>',
      pos: [6, 7],
    },
    {
      ch: '就',
      py: 'jiù',
      ru: '1) сразу, и ..., тотчас же, сейчас же, немедленно<br> 2) именно, как раз <br>3) тогда; то; в таком случае<br> 4) только, всего лишь<br> 5) =对, к ...., о ....<br> 6) =连 даже; если даже ',
      pos: [8],
    },
    {
      ch: '分解',
      py: 'fēnjiě',
      ru: '<div class="not_full"><div>1) распадаться, рассеиваться, разлагаться; распад, распадение; деструкция; деструктивный</div>\n<div>2) разлагать (<i>на элементы</i>); расщеплять; разбивать, раскалывать (<i>на отдельные части</i>); анализировать; разложение, расщепление; анализ; аналитический</div> <div class="hidden too_long td_word_hover">\n<div>3) рассеивать; диссоциировать, дифференцировать; диссоциация, дифференциация</div>\n<div>4) разъяснять, раскрывать (по пунктам, звеньям); разъяснение, раскрытие; анализ, аналитический</div>\n<div>5) <span class="green"><i>кит. мед.</i></span> разрежать, расслаблять; смягчать, заменять (снимать)</div>\n<div>6) <span class="green"><i>муз.</i></span> арпеджированный, ломаный</div>\n</div> <a class="more_link pt10 link_show gray" href="slovo.php?ch=%E5%88%86%E8%A7%A3">全词 &gt;&gt;</a></div>',
      pos: [9, 10],
    },
    {
      ch: '了',
      py: 'le',
      ru: '-л, стало, наступило, прошло (<i>частица прошедшего времи</i>)',
      pos: [11],
    },
    {
      ch: '健康检查',
      py: 'jiànkāng jiǎnchá',
      ru: 'медицинский осмотр, медицинское освидетельствование',
      pos: [12, 13, 14, 15],
    },
  ],
}

const cardRatio = 3 / 4

export default function TestPage() {
  const containerRef = useRef<HTMLDivElement>(null!)
  const scrollRef = useRef<HTMLDivElement>(null!)
  const cardWidth = scrollRef.current ? scrollRef.current.getBoundingClientRect().height * cardRatio : 0
  const [scrollWidth, setScrollWidth] = useState<number>(0)
  const xMv = useMotionValue(0)
  const progressMv = useTransform(xMv, [0, -cardWidth * res.cards.length], [0, 1], { clamp: false })
  const wordsScrolledMv = useTransform(progressMv, [0, 1], [0.5, res.cards.length - 0.5], { clamp: false })
  const debugRef = useRef<HTMLPreElement>(null!)
  const scrollMult = cardWidth / 2
  const router = useRouter()

  function getCurrentCardIndex(): number {
    return Math.round(wordsScrolledMv.get() - 0.5)
  }

  function scrollToNearestCard() {
    const nearestIndex = getCurrentCardIndex()
    scrollToCard(nearestIndex)
  }

  function scrollToCard(index: number) {
    const wordsScrolledTarget = index + 0.5
    const progressTarget = transform(wordsScrolledTarget, [0.5, res.cards.length - 0.5], [0, 1])
    const xTarget = transform(progressTarget, [0, 1], [0, -cardWidth * res.cards.length])
    animate(xMv, xTarget, { duration: 0.2 })
  }

  function controlClicked(moveBy: -1 | 1) {
    const currentCardIndex = getCurrentCardIndex()
    switch (moveBy) {
      case -1:
        if (currentCardIndex === 0) {
          scrollToCard(res.cards.length - 1)
        } else scrollToCard(currentCardIndex - 1)
        break
      case 1:
        if (currentCardIndex === res.cards.length - 1) {
          scrollToCard(0)
        } else scrollToCard(currentCardIndex + 1)
        break
    }
  }

  useEffect(() => {
    setScrollWidth(scrollRef.current.getBoundingClientRect().width)
  }, [cardWidth])

  useEffect(() => {
    progressMv.on(
      'change',
      (v) =>
        (debugRef.current.innerHTML = JSON.stringify(
          {
            scrollW: scrollWidth.toFixed(),
            cellWidth: cardWidth?.toFixed(2),
            x: xMv.get().toFixed(2),
            progress: progressMv.get().toFixed(2),
            wordsScrolled: wordsScrolledMv.get().toFixed(2),
          },
          null,
          2,
        )),
    )
  }, [scrollWidth])

  return (
    <div className='mt-24 text-zinc-200'>
      <button
        onClick={() => {
          animate(progressMv, 100)
        }}
      >
        + {cardWidth}
      </button>
      <pre ref={debugRef} className='text-xs'></pre>
      {/* refs */}
      <div className='mb-4'>
        <ul className='flex justify-center text-lg'>
          {res.refs.map((ref, i) => {
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
      <menu style={{ width: cardWidth + 'px' }} className='mx-auto mb-4 flex'>
        <Tooltip content='Копировать в поиск'>
          <motion.button onClick={() => {}} className='flex flex-1 items-center justify-center rounded-lg py-2 max-md:active:!bg-zinc-800 md:hover:!bg-zinc-800'>
            <TbArrowUp className='stroke-zinc-200' />
          </motion.button>
        </Tooltip>
        <div className='my-auto h-4 border-r border-zinc-800' />
        <Tooltip content='Копировать'>
          <motion.button className='flex flex-[2] items-center justify-center rounded-lg py-2 max-md:active:!bg-zinc-800 md:hover:!bg-zinc-800'>
            <TbCopy className='stroke-zinc-200' />
          </motion.button>
        </Tooltip>
        <div className='my-auto h-4 border-r border-zinc-800' />
        <Tooltip content='Открыть на 大БКРС'>
          <a target='_blank' href={''} className='flex-1 rounded-lg py-2 text-center text-sm font-light text-zinc-200 max-md:active:bg-zinc-800 md:hover:bg-zinc-800'>
            大
          </a>
        </Tooltip>
      </menu>
      {/* cards */}
      <div ref={containerRef} className='relative mx-auto max-w-screen-md'>
        <motion.aside
          onDoubleClick={() => {
            const card = res.cards[getCurrentCardIndex()]
            const trash = !(card.ch && card.py)
            if (trash) return
            router.push(`/search/${card.ch}`)
          }}
          ref={scrollRef}
          drag='x'
          style={{
            x: xMv,
            width: `calc(100% + ${cardWidth * res.cards.length}px)`,
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
        <ul className='relative z-[0] mx-auto flex h-64 justify-center [perspective:1000px] [transform-style:preserve-3d]' draggable={false}>
          {res.cards.map((card, i, arr) => {
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
                  <div className='line-clamp-5 px-4 text-center text-xs'>{stringToReact(card.ru)}</div>
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
      </div>
    </div>
  )
}
