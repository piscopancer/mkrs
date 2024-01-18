// import { parseSuggestFromRu } from '@/search'
import { classes } from '@/utils'
import Suggestions from '.'
import { TSearchProps } from '@/search'

export default function ChSuggestions(props: TSearchProps<'ch'>) {
  return (
    <>
      {/* <Suggest
        suggestions={5}
        parse={parseSuggestFromRu}
        button={({ isSelected, i, parsed, ...htmlProps }) => (
          <button {...htmlProps} className={classes(isSelected && '!bg-zinc-700', 'flex items-center gap-4 rounded-md px-3 py-1 hover:bg-zinc-700/50 w-full')}>
            <output className='text-zinc-500 text-sm'>{i + 1}</output>
            <span className='text-zinc-200 text-nowrap'>{parsed.startsWith}</span>
          </button>
        )}
        get={(parsed) => parsed.startsWith}
      /> */}
    </>
  )
}
