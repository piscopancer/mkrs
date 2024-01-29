'use client'

import { useEffect, useRef } from 'react'

export default function Vibrator({ pattern = [50] }: { pattern?: Iterable<number> }) {
  const selfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function vibrate() {
      navigator.vibrate(pattern)
      // console.log('vibrated', pattern)
    }
    selfRef.current?.parentElement?.addEventListener('click', vibrate)
    return () => {
      // Does not work when parent rerenders and the reference is lost.
      selfRef.current?.parentElement?.removeEventListener('click', vibrate)
    }
  }, [])

  return <div data-vibrator hidden ref={selfRef}></div>
}
