import { TExample } from '@/search'
import { classes, stringToReact } from '@/utils'
import Heading from './heading'

export default function Examples(props: React.ComponentProps<'section'> & { examples: TExample[] }) {
  const { examples, ...htmlProps } = props
  return (
    <section {...htmlProps} className={classes(htmlProps.className)}>
      <Heading text='примеры' className='mb-6' />
      <ul className='flex flex-col gap-2' data-search>
        {examples.map((ex, i) => (
          <li key={i} className='grid grid-cols-2 gap-x-8 rounded-lg px-4 py-2 text-zinc-400 even:bg-gradient-to-r even:from-zinc-800 even:to-transparent max-md:block max-md:px-2 max-md:py-1'>
            {ex.innerHtml && <div className='max-md:mb-1 max-md:text-sm'>{stringToReact(ex.innerHtml)}</div>}
            <p className='self-start text-lg text-zinc-300'>{ex.heading}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
