import { queryCharacter } from '@/search'
import { JSDOM } from 'jsdom'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ch = searchParams.get('ch')
  if (!ch) return
  const text = await queryCharacter(ch)
  const el = new JSDOM(text).window.document.body.querySelector('#ajax_search .margin_left')
  return new Response(el?.innerHTML)
}
