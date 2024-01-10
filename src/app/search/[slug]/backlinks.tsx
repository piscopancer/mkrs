import Link from 'next/link'
import { TbLink } from 'react-icons/tb'

export default function Backlinks(props: { links: string[] }) {
  return (
    <section className='relative p-4 rounded-md border-2 border-zinc-800 flex items-center gap-4'>
      <TbLink className='stroke-zinc-500 h-6 p-1 rounded-full bg-zinc-800 absolute top-0 left-0 -translate-y-1/2 -translate-x-1/2' />
      <ul className='flex items-center gap-2'>
        {props.links.map((link) => (
          <Link key={link} href={`/search/${link}`} data-custom>
            {link}
          </Link>
        ))}
      </ul>
    </section>
  )
}
