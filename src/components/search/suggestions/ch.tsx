import { BkrsResponseProps } from '@/bkrs'
import clsx from 'clsx'
import Suggestions from '.'
import SuggestionSelection from './selection'

export default function ChSuggestions(props: BkrsResponseProps<'ch'>) {
  return (
    <Suggestions
      suggestions={8}
      res={props.response}
      display={(search) => search.startWith ?? search.wordsWith ?? []}
      button={({ isSelected, i, display, ...htmlProps }) => {
        return (
          <button key={i} {...htmlProps} className='group relative flex w-full items-center gap-4 px-4 py-1'>
            <SuggestionSelection isSelected={isSelected} />
            <span className={clsx('line-clamp-1 min-w-0 overflow-hidden text-xl duration-100 group-hover:text-zinc-200', isSelected ? 'text-zinc-200' : 'text-zinc-400')}>{display}</span>
          </button>
        )
      }}
    />
  )
}
