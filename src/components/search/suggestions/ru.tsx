import { TSearchProps } from '@/search'
import clsx from 'clsx'
import Suggestions from '.'
import SuggestionSelection from './selection'

export default function RuSuggestions(props: TSearchProps<'ru'>) {
  return (
    <Suggestions
      suggestions={8}
      search={props.search}
      display={(search) => search.startWith ?? search.wordsWith ?? []}
      button={({ isSelected, i, display, ...htmlProps }) => {
        return (
          <button key={i} {...htmlProps} className='relative flex w-full items-center gap-4 px-4 py-1 hover:bg-zinc-700'>
            <SuggestionSelection isSelected={isSelected} />
            <span className={clsx('flex min-w-0 items-center gap-3 overflow-hidden text-ellipsis text-nowrap duration-200', isSelected ? 'text-zinc-200' : 'text-zinc-400')}>{display}</span>
          </button>
        )
      }}
    />
  )
}
