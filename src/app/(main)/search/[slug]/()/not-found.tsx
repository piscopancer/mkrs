import { TbBookOff } from 'react-icons/tb'

export default function NotFound() {
  return (
    <section className='mb-12 flex w-fit items-center gap-4 rounded-full border-2 border-zinc-800 px-4 py-2'>
      <TbBookOff className='h-5 stroke-zinc-400' />
      <output className='text-sm text-zinc-400'>Не найдено</output>
    </section>
  )
}
