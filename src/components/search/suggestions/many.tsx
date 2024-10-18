import { ReversoResponseProps } from '@/reverso'
import clsx from 'clsx'
import { TbAsterisk } from 'react-icons/tb'
import Suggestions from '.'
import SuggestionSelection from './selection'

export default function ManySuggestions(props: ReversoResponseProps<'many'>) {
  return (
    <Suggestions
      suggestions={8}
      res={props.response}
      display={(res) => res.translations ?? []}
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
