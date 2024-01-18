import { fonts } from '@/assets/fonts'
import { TExample } from '@/search'
import { classes, stringToReact } from '@/utils'
import Link from 'next/link'

export default function RuchFulltext(props: React.ComponentProps<'section'> & { examples: TExample[] }) {
  const { examples, ...htmlProps } = props
  return (
    <article {...htmlProps} className='mb-12'>
      <h1 className={classes(fonts.display, 'uppercase text-zinc-200 mb-8 text-sm')}>в русских словах</h1>
      <ul className='flex-col gap-2 grid grid-cols-[auto_1fr] gap-x-8 gap-y-2'>
        {examples.map((ex, i) => (
          <li key={i} className='contents text-zinc-400'>
            <Link href={`/search/${ex.heading}`} className='self-start' data-custom>
              {ex.heading}
            </Link>
            {ex.content && <>{stringToReact(ex.content)}</>}
          </li>
        ))}
      </ul>
    </article>
  )
}
