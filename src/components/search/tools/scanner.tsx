'use client'

import { Tooltip } from '@/components/tooltip'
import { searchStore } from '@/search'
import { type TComponent } from '@/utils'
import { clsx } from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { GiBrassEye } from 'react-icons/gi'
import { TbX } from 'react-icons/tb'
import { createWorker } from 'tesseract.js'

const nonChRegex = /\P{Script=Han}/gu

export default function Scanner({ props, ...attr }: TComponent<'article', {}>) {
  const workerRef = useRef<Tesseract.Worker | undefined>(undefined)
  const [scanning, setScanning] = useState(false)
  const [recognitions, setRecognitions] = useState<string[]>([])
  const [image, setImage] = useState<string | undefined>(undefined)

  useEffect(() => {
    createWorker('chi_sim', 1, {
      logger: (l) => {
        console.log(l.workerId, l.progress)
      },
    }).then((w) => {
      workerRef.current = w
      console.log(w, workerRef.current)
    })

    addEventListener('paste', onPaste)
    return () => {
      removeEventListener('paste', onPaste)
    }
  }, [])

  function onPaste(e: ClipboardEvent) {
    const file = e.clipboardData?.files[0]
    if (file && ['image/png', 'image/jpeg'].includes(file.type) && workerRef.current) {
      const imageData = URL.createObjectURL(file)
      setImage(imageData)
      recognize(workerRef.current, imageData)
    }
  }

  async function recognize(worker: Tesseract.Worker, image: string) {
    setScanning(true)
    const {
      data: { words },
    } = await worker.recognize(image, {}, {})
    setScanning(false)
    setRecognitions(
      words
        .flatMap((c) => c.text)
        .map((w) => w.replace(nonChRegex, ''))
        .filter(Boolean),
    )
  }

  return (
    <article {...attr} className={clsx(attr.className, 'flex')}>
      <header className='group hopper size-[20rem] shrink-0 rounded-b-3xl border-2 border-zinc-800 bg-zinc-900'>
        <input
          title=''
          type='file'
          accept='image/png, image/jpeg'
          className='size-full opacity-0'
          onChange={(e) => {
            const file = e.target.files?.[0]
            const imageData = file ? URL.createObjectURL(file) : undefined
            setImage(imageData)
            if (imageData && workerRef.current) {
              recognize(workerRef.current, imageData)
            } else {
              setRecognitions([])
            }
            e.target.value = ''
          }}
        />
        <div className={clsx('pointer-events-none flex w-full flex-col items-center justify-center duration-500 ease-out', image ? 'scale-90 opacity-0' : 'group-hover:scale-95')}>
          <GiBrassEye className='mb-6 aspect-square w-1/5' />
          <h1 className='w-2/3 text-center text-sm text-zinc-400'>
            <b>Выберите</b> файл с устройства, <b>перетащите</b> сюда или <b>вставьте</b> его с <kbd className='mx-1.5 mr-2 rounded-md px-2 font-mono text-xs shadow-[0_1px_0_2px_theme(colors.zinc.700)]'>Ctrl + V</kbd>
          </h1>
        </div>
        {image && (
          <>
            <div className='pointer-events-none overflow-hidden'>
              <img src={image} className='size-full object-contain p-8 saturate-0' />
            </div>
            <Tooltip content='Убрать изображение'>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setImage(undefined)
                  setRecognitions([])
                }}
                className='relative mr-2 mt-2 flex size-8 items-center justify-center justify-self-end rounded-full bg-zinc-800 hover:bg-zinc-700'
              >
                <TbX />
              </button>
            </Tooltip>
          </>
        )}
        <div className='pointer-events-none size-[calc(100%-2rem)] place-self-center rounded-xl border-[3px] border-dotted border-zinc-800 duration-100 group-hover:border-pink-500' />
      </header>
      <div className='h-fit min-h-32 grow rounded-r-3xl border-y-2 border-r-2 border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-800 px-4 py-6'>
        {scanning ? (
          <span className='animate-pulse'>Сканирую</span>
        ) : (
          <menu className='flex flex-wrap'>
            {recognitions.map((r, i) => (
              <li key={i}>
                <button
                  onClick={() => {
                    searchStore.inputValue = searchStore.inputValue + r
                  }}
                  className='border-b-2 border-zinc-700 px-1 pb-1 text-2xl text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
                >
                  {r}
                </button>
              </li>
            ))}
          </menu>
        )}
      </div>
    </article>
  )
}
