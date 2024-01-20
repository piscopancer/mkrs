import { TSearchProps } from '@/search'
import { classes } from '@/utils'
import Suggestions from '.'
import SuggestionSelection from './selection'
import { ByWords } from './util'

export default function ChSuggestions(props: TSearchProps<'ch'>) {
  return (
    <>
      {props.search.byWords ? (
        <ByWords words={props.search.byWords} />
      ) : (
        <Suggestions
          suggestions={5}
          search={props.search}
          get={(search) => search.startWith ?? search.wordsWith ?? []}
          display={(search) => search.startWith ?? search.wordsWith ?? []}
          button={({ isSelected, i, display, ...htmlProps }) => {
            return (
              <button key={i} {...htmlProps} className={classes('relative flex items-center gap-4 rounded-full px-3 py-1 hover:bg-zinc-700/50 w-full')}>
                <SuggestionSelection isSelected={isSelected} />
                <output className='text-zinc-500 text-sm'>{i + 1}</output>
                <span className='text-zinc-200 text-nowrap text-lg'>{display}</span>
              </button>
            )
          }}
        />
      )}
    </>
  )
}
