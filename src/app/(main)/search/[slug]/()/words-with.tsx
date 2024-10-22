import clsx from 'clsx'
import { ComponentProps } from 'react'
import ChLink from './ch-link'
import Header from './header'

export default function WordsWith({ words, ...htmlProps }: ComponentProps<'section'> & { words: string[] }) {
  return (
    <section {...htmlProps} className={clsx(htmlProps.className)}>
      <Header text='Слова с' className='mb-6' />
      <ul className='grid grid-cols-3 gap-1 max-md:grid-cols-2' data-search>
        {words.map((word) => (
          <li key={word}>
            <ChLink search={word} />
          </li>
        ))}
      </ul>
    </section>
  )
}
