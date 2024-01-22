import { project } from '@/project'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Недавние — ${project.name}`,
}

export default function RecentLayout({ children }: { children: React.ReactNode }) {
  return children
}
