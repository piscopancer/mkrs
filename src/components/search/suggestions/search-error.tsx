import { TSearchProps } from '@/search'

export default function SearchError(props: TSearchProps<'error'>) {
  return (
    <p className='text-center my-6 text-sm'>
      Ничего не найдено. Используйте <strong className='text-zinc-200'>китайский</strong> или <strong className='text-zinc-200'>русский</strong> языки или продолжайте вводить
    </p>
  )
}
