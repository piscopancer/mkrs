import { project } from '@/project'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Горячие клавиши — ${project.name}`,
}

export default function ShortcutsLayout({ children }: { children: React.ReactNode }) {
  return children
}
