import { rootMetadata } from '@/app/()'
import { project } from '@/project'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Горячие клавиши —  ${project.name}`,
  description: `${rootMetadata.description} ${project.name} использует горячие клавиши для удобной работы с сайтом, включая навигацию по страницам и выполнение действий со словами, например копирование и сохранение`,
}

export default function HotkeysLayout({ children }: { children: React.ReactNode }) {
  return children
}
