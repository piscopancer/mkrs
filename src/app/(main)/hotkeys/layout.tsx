import { project } from '@/project'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Горячие клавиши — ${project.name}`,
}

export default function HotkeysLayout({ children }: { children: React.ReactNode }) {
  return children
}
