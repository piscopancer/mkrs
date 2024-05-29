import { Example } from '@/bkrs'
import { stringToReact } from '@/utils'
import clsx from 'clsx'
import Link from 'next/link'
import Header from './header'

export default function RuchFulltext(props: React.ComponentProps<'section'> & { examples: Example[] }) {
  const { examples, ...htmlProps } = props
  return (
    <section {...htmlProps} className={clsx(htmlProps.className)}>
      <Header text='В русских словах' className='mb-6' />
      <ul className='grid grid-cols-[1fr_1fr] gap-2 gap-x-8 gap-y-2 max-md:flex max-md:flex-col max-md:gap-x-4' data-search>
        {examples.map((ex, i) => (
          <li key={i} className='contents rounded-lg py-2 text-lg text-zinc-400 max-md:block max-md:py-1 max-md:text-sm'>
            <Link href={`/search/${ex.heading}`} className='w-fit self-start max-md:mb-1' data-custom>
              {ex.heading}
            </Link>
            <div>{ex.innerHtml && stringToReact(ex.innerHtml)}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
