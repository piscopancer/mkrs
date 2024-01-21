import { TExample } from '@/search'
import { classes, stringToReact } from '@/utils'
import Link from 'next/link'
import Heading from './heading'

export default function RuchFulltext(props: React.ComponentProps<'section'> & { examples: TExample[] }) {
  const { examples, ...htmlProps } = props
  return (
    <section {...htmlProps} className={classes(htmlProps.className)}>
      <Heading text='в русских словах' className='mb-8' />
      <ul className='flex-col gap-2 grid grid-cols-[auto_1fr] gap-x-8 gap-y-2' data-search>
        {examples.map((ex, i) => (
          <li key={i} className='contents text-zinc-400'>
            <Link href={`/search/${ex.heading}`} className='self-start' data-custom>
              {ex.heading}
            </Link>
            {ex.content && <>{stringToReact(ex.content)}</>}
          </li>
        ))}
      </ul>
    </section>
  )
}
