import { TSimilar } from '@/search'
import { classes } from '@/utils'
import Link from 'next/link'
import Heading from './heading'

export default function Similar({ similar, ...htmlProps }: React.ComponentProps<'section'> & { similar: TSimilar[] }) {
  return (
    <section {...htmlProps} className={classes(htmlProps.className)}>
      <Heading text='похожие' className='mb-6' />
      <ul className='grid grid-cols-3 max-md:flex max-md:flex-col max-md:gap-1' data-search>
        {similar.map((similar, i) => (
          <li key={i}>
            <Link prefetch={false} href={`/search/${similar.search}`} className='text-lg max-md:text-base'>
              {/* {stringToReact(similar.innerHTML)} */}
              {similar.search}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
