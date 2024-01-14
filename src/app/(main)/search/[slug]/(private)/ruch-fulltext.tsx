import Link from 'next/link'
import { stringToReact } from '.'

export default function RuchFulltext(props: React.ComponentProps<'section'> & { pairs: { heading: string | null; content: string | null }[] }) {
  const { pairs, ...htmlProps } = props
  return (
    <section {...htmlProps}>
      <ul className='flex-col gap-2 text-sm grid grid-cols-[auto_1fr] gap-x-8 gap-y-2'>
        {pairs.map((pair, i) => (
          <li key={i} className='contents'>
            <Link href={`/search/${pair.heading}`} className='self-start' data-custom>
              {pair.heading}
            </Link>
            {pair.content && <>{stringToReact(pair.content)}</>}
          </li>
        ))}
      </ul>
    </section>
  )
}
