import { TSearchProps } from '@/search'
import { classes } from '@/utils'
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
          <button key={i} {...htmlProps} className={classes('relative flex items-center gap-4 rounded-full px-3 py-1 hover:bg-zinc-700/50 w-full')}>
            <SuggestionSelection isSelected={isSelected} />
            <span className='text-zinc-200 text-nowrap text-lg'>{display.ch}</span>
            <span className='text-zinc-400 text-nowrap max-md:text-sm'>{display.py}</span>
            <span className='text-zinc-200 text-nowrap max-md:text-sm overflow-hidden text-ellipsis block'>{display.ru}</span>
          </button>
        )
      }}
    />
  )
}
