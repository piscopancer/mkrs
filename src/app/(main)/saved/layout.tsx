import { project } from '@/project'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Сохраненные — ${project.name}`,
}

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children
}
