'use client'

import { useState } from 'react'

export default function TestPage() {
  const [data, setData] = useState('')

  return (
    <>
      <button
        onClick={async () => {
          const json = await fetch('https://jsonplaceholder.typicode.com/todos/1').then((res) => res.json())
          const d = JSON.stringify(json, null, 2)
          setData(d)
        }}
      >
        get data
      </button>
      <pre>{data}</pre>
    </>
  )
}
