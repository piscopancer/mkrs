import { TResultProps, parseWords } from '@/search'
import { useSnapshot } from 'valtio'
import { searchStore } from '../store'
import { useRouter } from 'next/navigation'

export default function Words() {
  const searchSnap = useSnapshot(searchStore)
  const router = useRouter()

  const el = document.createElement('div')
  el.innerHTML = searchSnap.resText
  const results = parseWords(el)

  return (
    <ul>
      {results.map((res, i) => (
        <li key={i}>{res.ch}</li>
      ))}
    </ul>
  )
}
