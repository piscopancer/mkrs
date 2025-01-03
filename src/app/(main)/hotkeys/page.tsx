'use client'

import { layoutStore } from '@/app/()/store'
import * as Article from '@/components/article'
import { Hotkey, hotkeys } from '@/hotkeys'
import { objectEntries } from '@/utils'
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import { GiMartini, GiPalmTree } from 'react-icons/gi'

const shortcutsGroups: Record<string, (Hotkey & { description?: string })[]> = {
  Поиск: [
    { ...hotkeys.focus, description: 'Фокусируется на строке поиска' },
    { ...hotkeys.clear, description: 'Очищает строку поиска' },
    { ...hotkeys.search, description: 'Ищет то, что сейчас в поисковой строке или предложенную идею в ней' },
    { ...hotkeys.tools, description: 'Открывает панель инструментов под строкой поиска' },
  ],
  'Взаимодействие со результатом': [
    { ...hotkeys.save, description: 'Сохраняет слово' },
    { ...hotkeys.copy, description: 'Копирует слово в буфер обмена' },
    { ...hotkeys['to-search'], description: 'Вставляет слово в строку поиска, но не начинает поиск самостоятельно' },
    { ...hotkeys['bkrs'], description: 'Открывает слово на 大БКРС' },
    { ...hotkeys.reverso, description: 'Открывает слово на Reverso Context' },
  ],
  Навигация: [
    { ...hotkeys['main-page'], description: 'Переходит на главную страницу' },
    { ...hotkeys['recent-page'], description: 'Переходит на страницу с недавними словами' },
    { ...hotkeys['saved-page'], description: 'Переходит на страницу с сохраненными словами' },
  ],
  'А также': [
    {
      name: 'Вставить',
      display: 'Ctrl + V',
      keys: ['v', 'м'],
      description: 'Вставляет текст из буфера обмена в строку поиска и сразу же ищет',
    },
    {
      name: 'Пред. страница',
      display: 'Alt + <-',
      keys: ['LeftArrow'],
      description: 'Переходит на предыдущюю страницу',
    },
    {
      name: 'След. страница',
      display: 'Alt + ->',
      keys: ['RightArrow'],
      description: 'Переходит на следующую страницу',
    },
  ],
}

export default function HotkeysPage() {
  const selfAnim = useAnimation()

  useEffect(() => {
    selfAnim.set({ opacity: 0 })
    selfAnim.start({ opacity: 1 })
  }, [selfAnim])
  const mainContainer = layoutStore.mainContainer.use()

  const { scrollY } = useScroll({ container: mainContainer })
  const iconsTranslateY = useTransform(scrollY, (s) => s * 0.15)

  return (
    <motion.main animate={selfAnim} className='mb-24'>
      <article>
        <h1 className='mb-8 font-display text-lg font-medium text-zinc-200'>Горячие клавиши</h1>
        <div className='relative mb-8 overflow-hidden rounded-lg bg-zinc-800 pb-4 pt-10 max-md:px-3 max-md:py-2'>
          <motion.div className='absolute inset-0' style={{ y: iconsTranslateY }}>
            <GiMartini className='absolute -bottom-6 left-[5%] aspect-square w-[12%] rotate-3 fill-zinc-600 stroke-none max-md:w-[20%]' />
            <GiPalmTree className='absolute -bottom-2 right-[30%] aspect-square w-[12%] fill-zinc-700 stroke-none max-md:w-[20%]' />
            <GiPalmTree className='absolute -bottom-2 right-[10%] aspect-square w-[10%] -scale-x-100 fill-zinc-700 stroke-none max-md:w-[16%]' />
          </motion.div>
          <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-800' />
          <h2 className='relative ml-[22%] text-lg max-md:ml-0 max-md:text-base'>Постоянно ищете, копируете или вставляете?</h2>
          <p className='relative ml-[22%] text-zinc-400 max-md:ml-0 max-md:text-sm'>Не тянитесь лишний раз за мышкой, делайте все быстрее через горячие клавиши</p>
        </div>
        <ul className=''>
          {objectEntries(shortcutsGroups).map(([groupName, hotkeys]) => (
            <li key={groupName}>
              <h2 className='mb-6 font-display font-medium'>{groupName}</h2>
              <ul className='mb-12 grid w-full grid-cols-[3fr,2fr,2fr] items-center divide-y divide-zinc-800'>
                {hotkeys.map((hotkey, i) => (
                  <li key={i} className='col-span-full grid grid-cols-subgrid items-start'>
                    <span className='my-3 text-zinc-200'>{hotkey.name}</span>
                    <Article.kbd className='mx-0 my-3 text-sm'>{hotkey.display}</Article.kbd>
                    {hotkey.description && <span className='my-3 text-sm text-zinc-400'>{hotkey.description}</span>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </article>
    </motion.main>
  )
}
