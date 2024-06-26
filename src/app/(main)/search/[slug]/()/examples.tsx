import { Example } from '@/bkrs'
import { stringToReact } from '@/utils'
import clsx from 'clsx'
import Header from './header'

export default function Examples(props: React.ComponentProps<'section'> & { examples: Example[] }) {
  const { examples, ...htmlProps } = props
  return (
    <section {...htmlProps} className={clsx(htmlProps.className)}>
      <Header text='Примеры' className='mb-6' />
      <ul className='divide-y divide-zinc-800' data-search>
        {examples.map((ex, i) => (
          <li key={i} className='grid grid-cols-2 gap-x-8 py-3 text-zinc-400 max-md:block max-md:py-1'>
            {ex.innerHtml && <div className='max-md:mb-1 max-md:text-sm'>{stringToReact(ex.innerHtml)}</div>}
            <p className='self-start text-lg text-zinc-300'>{ex.heading}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
