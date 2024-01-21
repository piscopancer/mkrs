import { classes } from '@/utils'
import { TSearchProps, TWord } from '@/search'
import SuggestionSelection from './selection'
import Suggestions from '.'

export default function PySuggestions(props: TSearchProps<'py'>) {
  return (
    <Suggestions
      suggestions={5}
      search={props.search}
      display={(search) => (search.found ? search.words ?? [] : [])}
      button={({ isSelected, i, display, ...htmlProps }) => {
        return (
          <button key={i} {...htmlProps} className={classes('relative flex items-center gap-4 rounded-full px-3 py-1 hover:bg-zinc-700/50 w-full')}>
            <SuggestionSelection isSelected={isSelected} />
            <output className='text-zinc-500 text-sm'>{i + 1}</output>
            <span className='text-zinc-200 text-nowrap text-lg'>{display.ch}</span>
            <span className='text-zinc-400 text-nowrap'>{display.py}</span>
            <span className='text-zinc-200 text-nowrap overflow-hidden text-ellipsis block'>{display.ru}</span>
          </button>
        )
      }}
    />
  )
}
