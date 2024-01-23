import { TSearchProps } from '@/search'
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
          <button key={i} {...htmlProps} className='relative flex items-center gap-4 rounded-full px-2 py-1 hover:bg-zinc-700/50 w-full'>
            <SuggestionSelection isSelected={isSelected} />
            <span className='text-zinc-200 text-nowrap text-lg flex items-center gap-2'>
              <TbAsterisk className='stroke-zinc-600 text-sm' />
              {display}
            </span>
          </button>
        )
      }}
    />
  )
}
