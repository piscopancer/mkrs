import { rootMetadata } from '@/app/()'
import { project } from '@/project'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `История — ${project.name}`,
  description: `${rootMetadata.description} ${project.name} поддерживает историю поиска. ${project.name} автоматически добавляет просмотренные слова на эту страницу, чтобы вы их не потеряли.`,
}

export default function RecentLayout({ children }: { children: React.ReactNode }) {
  return children
}
