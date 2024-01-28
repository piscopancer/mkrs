'use client'

import { useEffect, useRef } from 'react'

export default function Vibrator({ pattern = [50] }: { pattern?: Iterable<number> }) {
  const selfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function vibrate() {
      navigator.vibrate(pattern)
      console.log('vibrated', pattern)
    }
    selfRef.current?.parentElement?.addEventListener('click', vibrate)
    return () => {
      selfRef.current?.parentElement?.removeEventListener('click', vibrate)
    }
  }, [selfRef.current])
  return <div data-vibrator hidden ref={selfRef}></div>
}
