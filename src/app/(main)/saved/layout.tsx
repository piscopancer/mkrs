import { rootMetadata } from '@/app/()'
import { project } from '@/project'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Сохраненные — ${project.name}`,
  description: `${rootMetadata.description} ${project.name} поддерживает сохранение слов. Вы можете сохранять понравившиеся вам слова, и они будут отображаться на этой странице.`,
}

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children
}
