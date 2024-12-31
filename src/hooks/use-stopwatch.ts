'use client'

import { useEffect, useRef } from 'react'

type UseStopwatchProps = {
  interval: number
  onInterval?: (time: number) => void
  initial?: number
}

export default function useStopwatch(args: UseStopwatchProps) {
  const time = useRef(args.initial ?? 0)
  const stopwatchRef = useRef<NodeJS.Timeout>(undefined!)

  useEffect(() => {
    return () => {
      clearInterval(stopwatchRef.current)
    }
  }, [])

  function resume() {
    stopwatchRef.current = setInterval(() => {
      time.current += args.interval
      args.onInterval?.(time.current)
    }, args.interval)
  }

  function start() {
    time.current = 0
    clearInterval(stopwatchRef.current)
    args.onInterval?.(time.current)
    resume()
  }

  function pause() {
    clearInterval(stopwatchRef.current)
    args.onInterval?.(time.current)
  }

  function stop() {
    pause()
    time.current = 0
    args.onInterval?.(0)
  }

  function travel(by: number) {
    time.current += by
    args.onInterval?.(time.current)
  }

  function set(to: number) {
    time.current = to
    clearInterval(stopwatchRef.current)
    args.onInterval?.(to)
    resume()
  }

  return { start, resume, pause, travel, stop, set }
}
