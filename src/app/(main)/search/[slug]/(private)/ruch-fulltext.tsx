import { TExample } from '@/search'
import { classes, stringToReact } from '@/utils'
import Link from 'next/link'
import Heading from './heading'

export default function RuchFulltext(props: React.ComponentProps<'section'> & { examples: TExample[] }) {
  const { examples, ...htmlProps } = props
  return (
    <section {...htmlProps} className={classes(htmlProps.className)}>
      <Heading text='в русских словах' className='mb-6' />
      <ul className='grid grid-cols-[auto_1fr] gap-2 gap-x-8 gap-y-2 max-md:flex max-md:flex-col max-md:gap-x-4' data-search>
        {examples.map((ex, i) => (
          <li key={i} className='contents rounded-lg py-2 text-lg text-zinc-400 max-md:block max-md:py-1 max-md:text-sm'>
            <Link href={`/search/${ex.heading}`} prefetch={false} className='w-fit self-start max-md:mb-1' data-custom>
              {ex.heading}
            </Link>
            <div>{ex.innerHtml && stringToReact(ex.innerHtml)}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
