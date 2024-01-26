import { TExample } from '@/search'
import { classes, stringToReact } from '@/utils'
import Heading from './heading'

export default function Examples(props: React.ComponentProps<'section'> & { examples: TExample[] }) {
  const { examples, ...htmlProps } = props
  return (
    <section {...htmlProps} className={classes(htmlProps.className)}>
      <Heading text='примеры' className='mb-6' />
      <ul className='flex-col gap-2 flex' data-search>
        {examples.map((ex, i) => (
          <li key={i} className='text-zinc-400 grid grid-cols-2 even:bg-gradient-to-r even:from-zinc-800 even:to-transparent py-2 px-4 rounded-lg gap-x-8 max-md:block max-md:px-2 max-md:py-1'>
            {ex.content && <div className='text-sm max-md:mb-1'>{stringToReact(ex.content)}</div>}
            <p className='self-start text-lg text-zinc-300'>{ex.heading}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
