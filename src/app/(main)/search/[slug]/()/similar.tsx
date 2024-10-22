import { type Similar } from '@/bkrs'
import clsx from 'clsx'
import ChLink from './ch-link'
import Header from './header'

export default function Similar({ similar, ...htmlProps }: React.ComponentProps<'section'> & { similar: Similar[] }) {
  return (
    <section {...htmlProps} className={clsx(htmlProps.className)}>
      <Header text='Похожие' className='mb-6' />
      <ul className='grid grid-cols-3 max-md:flex max-md:flex-col max-md:gap-1' data-search>
        {similar.map((similar, i) => (
          <li key={i}>
            <ChLink search={similar.search} />
          </li>
        ))}
      </ul>
    </section>
  )
}
