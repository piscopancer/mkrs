'use client'

import { useEffect, useRef } from 'react'

type UseStopwatchProps = {
  interval: number
  onInterval: (time: number) => void
  initial?: number
  startImmediately?: boolean
}

export default function useStopwatch(args: UseStopwatchProps) {
  const timeRef = useRef(args.initial ?? 0)
  const stopwatchRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (args.startImmediately) {
      start()
    }
    return () => {
      if (stopwatchRef.current) {
        clearInterval(stopwatchRef.current)
        stopwatchRef.current = null
      }
    }
  }, [args.startImmediately])

  function startInterval() {
    args.onInterval(timeRef.current)
    stopwatchRef.current = setInterval(() => {
      timeRef.current += args.interval
      args.onInterval?.(timeRef.current)
    }, args.interval)
  }

  function start() {
    args.onInterval(timeRef.current)
    if (stopwatchRef.current) {
      clearInterval(stopwatchRef.current)
      stopwatchRef.current = null
    }
    startInterval()
  }

  function stop() {
    args.onInterval(timeRef.current)
    if (stopwatchRef.current) {
      clearInterval(stopwatchRef.current)
      stopwatchRef.current = null
    }
  }

  function set(setter: number | ((prev: number) => number)) {
    let to: number | null = null
    if (typeof setter === 'function') {
      to = setter(timeRef.current)
    } else {
      to = setter
    }
    args.onInterval(to)
    timeRef.current = to
    if (stopwatchRef.current) {
      clearInterval(stopwatchRef.current)
      stopwatchRef.current = null
      startInterval()
    }
  }

  function get() {
    return timeRef.current
  }

  return { get, set, start, stop }
}
