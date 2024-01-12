'use client'

import useKey from '@/hooks/use-key'
import { useRouter } from 'next/navigation'

export default function KeyActions() {
  const router = useRouter()

  useKey([[['h', 'H'], () => router.push('/')]])
  return null
}
