'use client'

import { useRef, useState } from 'react'

export default function TestPage() {
  const [data, setData] = useState('')
  const [pending, setPending] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null!)

  return (
    <>
      <input type='text' ref={searchRef} />
      <button onClick={async () => {}}>get data</button>
      <pre>{(pending && 'pending') || data}</pre>
    </>
  )
}
