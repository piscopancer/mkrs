import Logo from '@/assets/logo.png'
import { createBkrsQueryOptions } from '@/bkrs'
import { project } from '@/project'
import { qc } from '@/query'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Metadata } from 'next'
import { ReactNode } from 'react'
import { type SearchLayout } from './()/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: SearchLayout): Promise<Metadata> {
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

export default async function SearchLayout({ children, params }: { children: ReactNode } & SearchLayout) {
  await qc.prefetchQuery(createBkrsQueryOptions(params.slug.trim()))

  return <HydrationBoundary state={dehydrate(qc)}>{children}</HydrationBoundary>
}
