import { NextPage } from '@/utils'

export type SearchPage = NextPage<'slug'>
export type SearchLayout = { params: { slug: string } }
