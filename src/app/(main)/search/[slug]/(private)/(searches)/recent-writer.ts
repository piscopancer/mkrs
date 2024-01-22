'use client'

import { addRecent } from '@/recent'
import { useEffect } from 'react'

export default function RecentWriter(props: { search: string }) {
  useEffect(() => addRecent(props.search), [props.search])
  return null
}
