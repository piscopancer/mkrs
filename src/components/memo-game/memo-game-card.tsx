'use client'

import useExpansion from '@/hooks/use-expansion'
import { TMotionComponent, theme } from '@/utils'
import clsx from 'clsx'
import { animate, motion, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { TbPlayerPlay, TbX } from 'react-icons/tb'

export default function MemoGameCard(props: TMotionComponent<'article', {}>) {
  const initialRef = useRef<HTMLDivElement>(null!)
  const expanderRef = useRef<HTMLDivElement>(null!)
  const expanderChildRef = useRef<HTMLDivElement>(null!)
  const buttonRef = useRef<HTMLButtonElement>(null!)
  const { expand, shrink, expandMV } = useExpansion({
    expanderRef,
    initialRef,
    transition: (base) => ({ ...base, duration: 1 }),
    onShrinkComplete: async () => {
      await animate(buttonRef.current, { y: 0 }, { duration: 0.5, ease: 'anticipate' })
      buttonRef.current.disabled = false
    },
  })

  return (
    <>
      <motion.article
        {...props}
        ref={initialRef}
        transition={{ type: 'spring', stiffness: 300 }}
        whileTap={{
          scaleY: 0.95,
          scaleX: 1.02,
        }}
        className={clsx('origin-bottom', props.className)}
      >
        <div className='group w-48 overflow-hidden rounded-xl bg-zinc-800 p-2'>
          <motion.button
            ref={buttonRef}
            onClick={async () => {
              buttonRef.current.disabled = true
              await animate(buttonRef.current, { y: '120%' }, { duration: 0.5, ease: 'anticipate' })
              expand()
            }}
            className='size-full rounded-md border-2 border-zinc-900'
          >
            <div className='aspect-square p-2 duration-200 ease-out group-hover:scale-110 group-hover:p-4'>
              <ul className='grid size-full grid-cols-[1fr_1fr] grid-rows-[1fr_1fr] items-center justify-center'>
                <li className='flex size-full items-center justify-center text-5xl text-zinc-900'>菲</li>
                <li className='hopper size-full'>
                  <motion.div
                    animate={{
                      y: [-3, -8],
                      x: [-3, -5],
                      transition: {
                        duration: 1.5,
                        delay: 0.5,
                        repeatType: 'mirror',
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }}
                    className='flex size-full items-center justify-center rounded-tr-md text-6xl text-pink-500'
                  >
                    小
                  </motion.div>
                  <div className='flex size-full items-center justify-center rounded-tr-md text-6xl text-zinc-900'>小</div>
                </li>
                <li className='hopper size-full'>
                  <motion.div
                    animate={{
                      y: [-3, -8],
                      x: [-3, -5],
                      transition: {
                        duration: 1.5,
                        repeatType: 'mirror',
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }}
                    className='flex size-full items-center justify-center rounded-tr-md text-6xl text-pink-500'
                  >
                    小
                  </motion.div>
                  <div className='flex size-full items-center justify-center rounded-tr-md text-6xl text-zinc-900'>小</div>
                </li>
                <li className='flex size-full items-center justify-center text-5xl text-zinc-900'>街</li>
              </ul>
            </div>
            <header className='flex items-center border-t-2 border-zinc-900'>
              <h1 className='mx-1 my-1 w-fit rounded-sm bg-zinc-900 px-2 text-left text-lg font-medium text-zinc-300'>玩游戏</h1>
              <TbPlayerPlay className='ml-auto mr-3 size-5 -translate-x-[2px] stroke-pink-500 opacity-0 duration-300 group-hover:translate-x-0 group-hover:opacity-100' />
            </header>
          </motion.button>
        </div>
      </motion.article>
      <motion.div
        style={{
          padding: useTransform(expandMV, [0, 1], [theme.padding[2], theme.padding[4]]),
          background: useTransform(expandMV, [0, 1], [theme.colors.zinc[800], theme.colors.zinc[900]]),
        }}
        ref={expanderRef}
        className={clsx('fixed hidden rounded-xl')}
      >
        <motion.div
          style={{
            opacity: useTransform(expandMV, [0.5, 1], ['0', '1']),
            borderColor: useTransform(expandMV, [0, 1], ['#00000000', theme.colors.zinc[700]]),
          }}
          ref={expanderChildRef}
          className='relative size-full rounded-md border-2 border-zinc-900'
        >
          <button onClick={shrink} className=' rounded-lg'>
            <TbX className='size-16 stroke-zinc-500 p-4 duration-200 hover:stroke-zinc-100' />
          </button>
          {/* <MemoGame cards={[{ text: '连' }, { text: '分' }, { text: '手' }, { text: '人' }, { text: '头' }, { text: '个' }, { text: '提' }, { text: '供' }]} /> */}
        </motion.div>
      </motion.div>
    </>
  )
}
