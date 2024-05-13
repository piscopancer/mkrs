import logo from '@/assets/logo.png'
import { project } from '@/project'
import type { Metadata } from 'next'

export const rootMetadata = {
  description: project.description,
  openGraph: {
    title: project.name,
    description: project.description,
    images: [{ url: logo.src }],
    siteName: project.name,
    locale: 'ru',
    url: project.url,
    creators: [project.creator.nickname],
  },
  other: {
    'yandex-verification': '80460a4d9f477d0e',
  },
} as const satisfies Metadata
