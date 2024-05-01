import { TSimilar } from '@/search'
import clsx from 'clsx'
import Link from 'next/link'
import Header from './header'

export default function Similar({ similar, ...htmlProps }: React.ComponentProps<'section'> & { similar: TSimilar[] }) {
  return (
    <section {...htmlProps} className={clsx(htmlProps.className)}>
      <Header text='похожие' className='mb-6' />
      <ul className='grid grid-cols-3 max-md:flex max-md:flex-col max-md:gap-1' data-search>
        {similar.map((similar, i) => (
          <li key={i}>
            <Link href={`/search/${similar.search}`} className='text-lg max-md:text-sm'>
              {/* {stringToReact(similar.innerHTML)} */}
              {similar.search}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
