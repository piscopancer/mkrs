'use client'

import { canvasSizesInfo, handwritingStore, strokeSizesInfo } from '@/handwriting'
import { searchStore } from '@/search'
import { objectEntries, type TComponent } from '@/utils'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { clsx } from 'clsx'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type ForwardedRef } from 'react'
import { TbArrowBackUp, TbBorderOuter, TbEraser, TbPencil, TbPointFilled } from 'react-icons/tb'
import { zinc } from 'tailwindcss/colors'
import { createWorker } from 'tesseract.js'
import { useSnapshot } from 'valtio'
import { subscribeKey } from 'valtio/utils'
import SelectBar from '../../select-bar'

export default function Handwriting({ props, ...attr }: TComponent<'article', {}>) {
  let worker: Tesseract.Worker | undefined = undefined
  const [recognitions, setRecognitions] = useState<string[]>([])
  const drawingCanvasRef = useRef<DrawingCanvasRef>(null!)
  const handwritingSnap = useSnapshot(handwritingStore)

  useEffect(() => {
    createWorker('chi_sim', 1).then((w) => (worker = w))
  }, [])

  async function recognize(worker: Tesseract.Worker, canvas: HTMLCanvasElement) {
    const {
      data: { symbols },
    } = await worker.recognize(canvas, {}, {})
    setRecognitions(symbols.flatMap((s) => s.choices).flatMap((c) => c.text))
  }

  return (
    <article {...attr} className={clsx(attr.className, 'flex')}>
      <div className='rounded-b-3xl border-2 border-zinc-800 bg-zinc-900'>
        <div className='group hopper'>
          <DrawingCanvas
            props={{
              onChange: (canvas) => {
                worker && recognize(worker, canvas)
              },
            }}
            style={{ width: `${canvasSizesInfo[handwritingSnap.canvasSize].rem}rem` }}
            ref={drawingCanvasRef}
            className='aspect-square w-full cursor-crosshair duration-200'
          />
          {/* <div className='pointer-events-none h-4/5 w-0.5 place-self-center bg-gradient-to-b from-zinc-800 via-transparent to-zinc-800 opacity-50 duration-300 group-hover:opacity-100' /> */}
          {/* <div className='pointer-events-none h-0.5 w-4/5 place-self-center bg-gradient-to-r from-zinc-800 via-transparent to-zinc-800 opacity-50 duration-300 group-hover:opacity-100' /> */}
        </div>
        <menu className='mb-2 flex px-4'>
          <li className='mr-2'>
            <Dropdown.Root>
              <Dropdown.Portal>
                <Dropdown.Content side='top' sideOffset={8} className='z-[1] rounded-lg bg-zinc-800 p-2'>
                  <fieldset>
                    <legend className='mb-2 flex items-center font-mono text-xs text-zinc-500'>
                      <TbPencil className='mr-2 size-4' />
                      Толщина карандаша
                    </legend>
                    <SelectBar
                      props={{
                        options: objectEntries(strokeSizesInfo),
                        display: (o) => o[0],
                        onSelect: (o) => {
                          handwritingStore.strokeSize = o[0]
                        },
                        selected: (o) => o[0] == handwritingSnap.strokeSize,
                      }}
                    />
                  </fieldset>
                  <Dropdown.Arrow className='fill-zinc-800' />
                </Dropdown.Content>
              </Dropdown.Portal>
              <Dropdown.Trigger className='flex items-center rounded-lg border border-zinc-800 px-2 py-0.5 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400'>
                <TbPencil className='mr-1 size-5' />
                <TbPointFilled style={{ scale: strokeSizesInfo[handwritingSnap.strokeSize].scale }} className='size-4 fill-zinc-300' />
              </Dropdown.Trigger>
            </Dropdown.Root>
          </li>
          <li className='mr-auto'>
            <Dropdown.Root>
              <Dropdown.Portal>
                <Dropdown.Content side='top' sideOffset={8} className='z-[1] rounded-lg bg-zinc-800 p-2'>
                  <fieldset>
                    <legend className='mb-2 flex items-center font-mono text-xs text-zinc-500'>
                      <TbBorderOuter className='mr-2 size-4' />
                      Размер холста
                    </legend>
                    <SelectBar
                      props={{
                        options: objectEntries(canvasSizesInfo),
                        display: (o) => o[0],
                        onSelect: (o) => {
                          handwritingStore.canvasSize = o[0]
                        },
                        selected: (o) => o[0] === handwritingSnap.canvasSize,
                      }}
                    />
                  </fieldset>
                  <Dropdown.Arrow className='fill-zinc-800' />
                </Dropdown.Content>
              </Dropdown.Portal>
              <Dropdown.Trigger className='flex items-center rounded-lg border border-zinc-800 px-2 py-0.5 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400'>
                <TbBorderOuter className='mr-1 size-5' />
                <span className='font-mono text-sm'>{canvasSizesInfo[handwritingSnap.canvasSize].rem}</span>
              </Dropdown.Trigger>
            </Dropdown.Root>
          </li>
          <li>
            <button onClick={() => drawingCanvasRef.current.back()} className='ml-auto px-2 text-zinc-500 hover:text-zinc-300'>
              <TbArrowBackUp className='size-6' />
            </button>
          </li>
          <li>
            <button onClick={() => drawingCanvasRef.current.clear()} className='px-2 text-zinc-500 hover:text-zinc-300'>
              <TbEraser className='size-6' />
            </button>
          </li>
        </menu>
      </div>
      <div className='h-fit grow rounded-r-3xl border-y-2 border-r-2 border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-800 px-4 py-3'>
        <menu className='flex min-h-24 flex-wrap gap-2'>
          {recognitions.map((r, i) => (
            <li key={i}>
              <button
                onClick={() => {
                  searchStore.inputValue = searchStore.inputValue + r
                }}
                className='border-b-2 border-zinc-700 pb-1 text-3xl text-zinc-300 hover:border-zinc-500 hover:text-zinc-200'
              >
                {r}
              </button>
            </li>
          ))}
        </menu>
      </div>
    </article>
  )
}

type DrawingCanvasRef = {
  back: () => void
  clear: () => void
}

const DrawingCanvas = forwardRef(_DrawingCanvas)

function _DrawingCanvas({ props, ...attr }: TComponent<'canvas', { onChange: (canvas: HTMLCanvasElement) => void }>, ref: ForwardedRef<DrawingCanvasRef>) {
  const selfRef = useRef<HTMLCanvasElement>(null!)
  let mouseHeldDown = false
  let prevMousePos: { x: number; y: number } | undefined = undefined
  const canvasSize = 1024
  const [history, setHistory] = useState<ImageData[]>([])

  useImperativeHandle(ref, () => ({
    back: () => {
      if (!history.length) {
        return
      }
      const newHistory = history.toSpliced(history.length - 1, 1)
      setHistory(newHistory)
      if (newHistory.length === 0) {
        selfRef.current.getContext('2d')?.clearRect(0, 0, canvasSize, canvasSize)
      } else if (newHistory.length > 0) {
        selfRef.current.getContext('2d')?.putImageData(newHistory[newHistory.length - 1], 0, 0)
      }
      props.onChange(selfRef.current)
    },
    clear: () => {
      setHistory([])
      const ctx = selfRef.current.getContext('2d')!
      ctx.clearRect(0, 0, canvasSize, canvasSize)
      ctx.fillStyle = zinc[900]
      ctx.fillRect(0, 0, canvasSize, canvasSize)
      props.onChange(selfRef.current)
    },
  }))

  useEffect(() => {
    const ctx = selfRef.current.getContext('2d')!
    ctx.fillStyle = zinc[900]
    ctx.fillRect(0, 0, canvasSize, canvasSize)
    ctx.strokeStyle = zinc[300]
    ctx.lineWidth = handwritingStore.strokeSize
    selfRef.current.addEventListener('mousedown', () => {
      mouseHeldDown = true
    })
    selfRef.current.addEventListener('mouseleave', () => {
      mouseHeldDown = false
      prevMousePos = undefined
      props.onChange(selfRef.current)
    })
    selfRef.current.addEventListener('mouseup', () => {
      mouseHeldDown = false
      prevMousePos = undefined
      props.onChange(selfRef.current)
      setHistory((prev) => [...prev, ctx.getImageData(0, 0, canvasSize, canvasSize)])
    })
    selfRef.current.addEventListener('mousemove', (e) => {
      if (!mouseHeldDown) return
      const canvasRect = selfRef.current.getBoundingClientRect()
      const x = ((e.clientX - canvasRect.left) * canvasSize) / canvasRect.width
      const y = ((e.clientY - canvasRect.top) * canvasSize) / canvasRect.height
      if (!prevMousePos) {
        prevMousePos = { x, y }
      }
      ctx.beginPath()
      ctx.moveTo(prevMousePos?.x ?? x, prevMousePos?.y ?? y)
      ctx.lineTo(x, y)
      ctx.stroke()
      prevMousePos = { x, y }
    })
    const unsub = subscribeKey(handwritingStore, 'strokeSize', (s) => {
      const ctx = selfRef.current.getContext('2d')!
      ctx.lineWidth = s
    })
    return () => {
      unsub()
    }
  }, [])

  return <canvas {...attr} width={canvasSize} height={canvasSize} ref={selfRef} className={clsx(attr.className, 'rounded-3xl')}></canvas>
}
