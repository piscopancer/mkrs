import { TSearchProps } from '@/search'
import clsx from 'clsx'
import Suggestions from '.'
import SuggestionSelection from './selection'

export default function PySuggestions(props: TSearchProps<'py'>) {
  return (
    <Suggestions
      suggestions={8}
      search={props.search}
      display={(search) => (search.found ? search.words ?? [] : [])}
      button={({ isSelected, i, display, ...htmlProps }) => {
        return (
          <button key={i} {...htmlProps} className={clsx('group relative flex w-full items-end gap-4 px-4 py-1')}>
            <SuggestionSelection isSelected={isSelected} />
            <span className={clsx('text-nowrap text-xl duration-100 group-hover:text-zinc-200', isSelected ? 'text-zinc-200' : 'text-zinc-400')}>{display.ch}</span>
            <span className={clsx('text-nowrap duration-100 group-hover:text-zinc-200 max-md:text-sm', isSelected ? 'text-zinc-300' : 'text-zinc-500')}>{display.py}</span>
            <span className={clsx('block overflow-hidden text-ellipsis text-nowrap duration-100 group-hover:text-zinc-200 max-md:text-sm', isSelected ? 'text-zinc-200' : 'text-zinc-400')}>{display.ru}</span>
          </button>
        )
      }}
    />
  )
}
