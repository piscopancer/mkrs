import { TExample } from '@/search'
import { classes, stringToReact } from '@/utils'
import Link from 'next/link'
import Heading from './heading'

export default function RuchFulltext(props: React.ComponentProps<'section'> & { examples: TExample[] }) {
  const { examples, ...htmlProps } = props
  return (
    <section {...htmlProps} className={classes(htmlProps.className)}>
      <Heading text='в русских словах' className='mb-6' />
      <ul className='max-md:flex-col gap-2 grid grid-cols-[auto_1fr] gap-x-8 gap-y-2 max-md:gap-x-4 max-md:text-sm max-md:flex' data-search>
        {examples.map((ex, i) => (
          <li key={i} className='contents text-zinc-400 max-md:flex max-md:flex-col px-4 py-2 max-md:px-2 max-md:py-1 rounded-lg even:bg-gradient-to-r even:from-zinc-800 even:to-transparent max-md:gap-1'>
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
