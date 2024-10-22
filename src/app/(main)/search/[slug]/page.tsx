import { queryBkrs } from '@/app/actions'
import Logo from '@/assets/logo.png'
import { BkrsResponseProps, BkrsResponseType } from '@/bkrs'
import { project } from '@/project'
import { type Response } from '@/search'
import { Metadata } from 'next'
import { ReactNode } from 'react'
import Ch from './()/(searches)/ch'
import ChLong from './()/(searches)/ch-long'
import English from './()/(searches)/en'
import Py from './()/(searches)/py'
import Ru from './()/(searches)/ru'
import { TSearchPage } from './()/util'

export async function generateMetadata({ params }: TSearchPage): Promise<Metadata> {
  const slug = decodeURI(params.slug)
  const title = `${slug} — ${project.name}`
  const description = `Смотрите перевод "${slug}" на МКРС`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: Logo.src }],
    },
  }
}

export default async function SearchPage({ params }: TSearchPage) {
  const response = await queryBkrs(params.slug.trim())

  if (!response) {
    return null
  }

  return <Response response={response} />
}

const responses = {
  ch: Ch,
  ru: Ru,
  py: Py,
  'ch-long': ChLong,
  english: English,
} satisfies { [T in BkrsResponseType]: (props: BkrsResponseProps<T>) => ReactNode }

function Response<T extends BkrsResponseType>(props: BkrsResponseProps<T>) {
  return responses[props.response.type](props as never)
}
