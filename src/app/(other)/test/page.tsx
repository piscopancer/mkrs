'use client'

// import ex4 from '@/assets/ex4.png'
import { useEffect, useRef, useState } from 'react'
import Tesseract, { createWorker } from 'tesseract.js'

// const imgUrl = 'https://sun9-19.userapi.com/impg/Ee1XIc14D2nlxSDIZpXiTL6968oJuzwJQUNQHg/Ixcvcm650NQ.jpg?size=1244x308&quality=96&sign=64c4a37722ab109ea12a6889877b1717&type=album'

export default function TestPage() {
  const [recognition, setRecognition] = useState<any | undefined>(undefined)
  const [debug, setDebug] = useState<any>(undefined)
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  let worker: Tesseract.Worker | undefined = undefined
  let mouseHeldDown = false
  let prevMousePos: { x: number; y: number } | undefined = undefined
  const canvasSize = 1024

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')!
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvasSize, canvasSize)
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 15

    canvasRef.current.addEventListener('mousedown', (e) => {
      mouseHeldDown = true
    })

    canvasRef.current.addEventListener('mouseleave', (e) => {
      mouseHeldDown = false
      worker && recognize(worker)
    })

    canvasRef.current.addEventListener('mouseup', (e) => {
      mouseHeldDown = false
      prevMousePos = undefined
      worker && recognize(worker)
    })

    canvasRef.current.addEventListener('mousemove', (e) => {
      if (!mouseHeldDown) return
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const x = ((e.clientX - canvasRect.left) * canvasSize) / canvasRect.width
      const y = ((e.clientY - canvasRect.top) * canvasSize) / canvasRect.height
      if (!prevMousePos) {
        prevMousePos = { x, y }
      }
      // console.log({ x: prevMousePos?.x ?? x, y: prevMousePos?.y ?? y })
      ctx.beginPath()
      ctx.moveTo(prevMousePos?.x ?? x, prevMousePos?.y ?? y)
      ctx.lineTo(x, y)
      ctx.stroke()
      prevMousePos = { x, y }
    })

    createSetWorker().then((w) => {
      worker = w
      recognize(w)
    })
  }, [])

  async function createSetWorker() {
    const worker = await createWorker('chi_sim', 1, {
      logger: ({ status, progress }) => {
        setDebug({ status, progress })
      },
    })
    return worker
  }

  async function recognize(worker: Tesseract.Worker) {
    const {
      data: { text, words },
    } = await worker.recognize(canvasRef.current, {}, {})
    setRecognition({ text, words: words.map((w) => w.symbols.map((s) => s.choices)) })
  }

  return (
    <div className=''>
      <pre className='p-4 text-xs text-lime-500'>{JSON.stringify(debug)}</pre>
      <canvas width={canvasSize} height={canvasSize} ref={canvasRef} className='mt-8 size-64 rounded-lg border border-zinc-500'></canvas>
      <pre className='p-4 text-xs'>{JSON.stringify(recognition, null, 2)}</pre>
    </div>
  )
}
