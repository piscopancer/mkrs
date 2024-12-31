'use client'

import { BkrsResponseProps, BkrsResponseType, useBkrsQuery } from '@/bkrs'
import { type Response } from '@/search'
import { ReactNode } from 'react'
import Ch from './()/(searches)/ch'
import ChLong from './()/(searches)/ch-long'
import English from './()/(searches)/en'
import Py from './()/(searches)/py'
import Ru from './()/(searches)/ru'
import { type SearchPage } from './()/utils'

export default function SearchPage({ params }: SearchPage) {
  const { data: response } = useBkrsQuery(params.slug.trim())

  if (!response) {
    return <p>loading...</p>
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
