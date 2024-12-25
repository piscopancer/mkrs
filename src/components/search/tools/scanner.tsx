'use client'

import { Tooltip } from '@/components/tooltip'
import { searchStore } from '@/search'
import { scannerStore } from '@/stores/scanner'
import { type TComponent } from '@/utils'
import { clsx } from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { GiBrassEye } from 'react-icons/gi'
import { TbInfoCircle, TbX } from 'react-icons/tb'
import { createWorker } from 'tesseract.js'

const nonChRegex = /\P{Script=Han}/gu

export default function Scanner({ props, ...attr }: TComponent<'article', {}>) {
  const workerRef = useRef<Tesseract.Worker | undefined>(undefined)
  const [scanning, setScanning] = useState(false)
  const scannerSnap = scannerStore.use()

  useEffect(() => {
    createWorker('chi_sim', 1).then((w) => {
      workerRef.current = w
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
      scannerStore.assign({
        imageData,
      })
      recognize(workerRef.current, imageData)
    }
  }

  async function recognize(worker: Tesseract.Worker, image: string) {
    setScanning(true)
    const { data } = await worker.recognize(image, {}, {})
    setScanning(false)
    const words = data.words
      .flatMap((c) => c.text)
      .map((w) => w.replace(nonChRegex, ''))
      .filter(Boolean)
    scannerStore.recognitions.set(words)
  }

  return (
    <article {...attr} className={clsx(attr.className, 'flex h-[20rem]')}>
      <header className='group hopper aspect-square shrink-0 rounded-bl-3xl border-2 border-zinc-800 bg-zinc-900/90'>
        <input
          title=''
          type='file'
          accept='image/png, image/jpeg'
          className='size-full opacity-0'
          onChange={(e) => {
            const file = e.target.files?.[0]
            const imageData = file ? URL.createObjectURL(file) : undefined
            scannerStore.assign({
              imageData,
            })
            if (imageData && workerRef.current) {
              recognize(workerRef.current, imageData)
            } else {
              scannerStore.recognitions.set([])
            }
            e.target.value = ''
          }}
        />
        <div className={clsx('pointer-events-none flex w-full flex-col items-center justify-center duration-500 ease-out', scannerSnap.imageData ? 'scale-90 opacity-0' : 'group-hover:scale-95')}>
          <GiBrassEye className='mb-6 aspect-square w-1/5' />
          <h1 className='w-2/3 text-center text-sm text-zinc-400'>
            <b>Выберите</b> файл с устройства, <b>перетащите</b> сюда или <b>вставьте</b> его с <kbd className='mx-1.5 mr-2 rounded-md px-2 font-mono text-xs shadow-key'>Ctrl + V</kbd>
          </h1>
        </div>
        {scannerSnap.imageData && (
          <>
            <div className='pointer-events-none overflow-hidden'>
              <img src={scannerSnap.imageData ?? undefined} alt='Изображение из кэша' className='size-full object-contain p-8 saturate-0' />
            </div>
            <Tooltip content='Убрать изображение'>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  scannerStore.assign({
                    imageData: undefined,
                  })
                  scannerStore.recognitions.set([])
                }}
                className='relative mr-2 mt-2 flex size-8 items-center justify-center justify-self-end rounded-full bg-zinc-800 hover:bg-zinc-700'
              >
                <TbX />
              </button>
            </Tooltip>
          </>
        )}
        <div className='pointer-events-none size-[calc(100%-2rem)] place-self-center rounded-xl border-[3px] border-dashed border-zinc-800 duration-100 group-hover:border-pink-500' />
      </header>
      <section className='flex grow flex-col rounded-r-xl border-y-2 border-r-2 border-zinc-800 bg-zinc-900/90 px-4'>
        <header className='my-2 flex items-center justify-end text-sm'>
          <Tooltip
            content={
              <>
                Сканер расчитан на <b>печатный</b> текст. Убедитесь, чтобы картинки были в <b>хорошем</b> качестве. Если сканирования не происходит, скорее всего, сканер еще не загрузился.
              </>
            }
            className='max-w-[42ch] text-center'
          >
            <button className='mr-2 flex size-8 cursor-default items-center justify-center gap-2 text-zinc-400'>
              <TbInfoCircle className='size-4' />
            </button>
          </Tooltip>
          <button
            onClick={() => {
              searchStore.showSuggestions.set(false)
              searchStore.showTools.set(false)
            }}
            className='flex size-8 items-center justify-center rounded-full hover:bg-zinc-800'
          >
            <TbX className='size-4' />
          </button>
        </header>
        {scanning ? (
          <span className='animate-pulse'>Сканируется...</span>
        ) : (
          <menu className='mb-4 flex max-h-full flex-wrap overflow-auto'>
            {scannerSnap.recognitions.map((r, i) => (
              <li key={i}>
                <button
                  onClick={() => {
                    searchStore.search.set((prev) => prev + r)
                  }}
                  className='border-b-2 border-dashed border-zinc-800 px-1 pb-1 text-2xl text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                >
                  {r}
                </button>
              </li>
            ))}
          </menu>
        )}
      </section>
    </article>
  )
}
