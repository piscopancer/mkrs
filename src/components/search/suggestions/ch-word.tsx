import { stringToReact } from '@/app/(main)/search/[slug]/(private)'
import { useSnapshot } from 'valtio'
import { searchStore } from '../store'

export default function ChWord() {
  const searchSnap = useSnapshot(searchStore)

  const el = document.createElement('div')
  el.innerHTML = searchSnap.resText
  const untouched = {
    ruTrs: el.querySelector('.ru')?.innerHTML,
  }

  const data = {
    ch: el.querySelector('#ch')?.textContent ?? '',
    py: el.querySelector('.py')?.textContent ?? '',
  }
  console.log(data.ch, data.py)

  return (
    <article className='flex gap-4 items-start'>
      <h1 className='font-bold text-zinc-200'>{data.ch}</h1>
      <h2 className='italic text-nowrap'>{data.py}</h2>
      {untouched.ruTrs && <div className='grow overflow-hidden line-clamp-3'>{stringToReact(untouched.ruTrs)}</div>}
    </article>
  )
}
