'use client'

import { store } from '@davstack/store'

let timer: NodeJS.Timeout | null = null

const searchStore = store({
  search: '',
  debouncedSearch: '',
}).effects((store) => ({
  debounce() {
    return store.search.onChange((v) => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        searchStore.debouncedSearch.set(v.trim())
      }, 1000)
    })
  },
}))

export default function TestPage() {
  const searchSnap = searchStore.use()

  return (
    <div className='mt-24 text-zinc-200'>
      <pre className='text-zinc-500'>{JSON.stringify(searchSnap, null, 2)}</pre>
      <p>{searchSnap.search}</p>
      <input
        onChange={(e) => {
          searchStore.search.set(e.target.value)
        }}
      />
    </div>
  )
}
