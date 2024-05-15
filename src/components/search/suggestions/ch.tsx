import { TSearchProps } from '@/search'
import clsx from 'clsx'
import { TbAsterisk } from 'react-icons/tb'
import Suggestions from '.'
import SuggestionSelection from './selection'

export default function ChSuggestions(props: TSearchProps<'ch'>) {
  return (
    <Suggestions
      suggestions={8}
      search={props.search}
      display={(search) => search.startWith ?? search.wordsWith ?? []}
      button={({ isSelected, i, display, ...htmlProps }) => {
        return (
          <button key={i} {...htmlProps} className='group relative flex w-full items-center gap-4 px-2 py-1'>
            <SuggestionSelection isSelected={isSelected} />
            <span className={clsx('flex min-w-0 items-center gap-2 overflow-hidden text-ellipsis text-nowrap text-xl duration-100 group-hover:text-zinc-200', isSelected ? 'text-zinc-200' : 'text-zinc-400')}>
              <TbAsterisk className='size-4 stroke-zinc-600' />
              {display}
            </span>
          </button>
        )
      }}
    />
  )
}
