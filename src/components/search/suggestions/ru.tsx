import { TSearchProps } from '@/search'
import { classes } from '@/utils'
import Suggestions from '.'

export default function RuSuggestions(props: TSearchProps<'ru'>) {
  return (
    <>
      <Suggestions
        suggestions={5}
        search={props.search}
        get={(search) => search.startWith ?? search.wordsWith ?? []}
        display={(search) => search.startWith ?? search.wordsWith ?? []}
        button={({ isSelected, i, display, ...htmlProps }) => {
          return (
            <button key={i} {...htmlProps} className={classes(isSelected && '!bg-zinc-700', 'flex items-center gap-4 rounded-md px-3 py-1 hover:bg-zinc-700/50 w-full')}>
              <output className='text-zinc-500 text-sm'>{i + 1}</output>
              <span className='text-zinc-200 text-nowrap'>{display}</span>
            </button>
          )
        }}
      />
    </>
  )
}
