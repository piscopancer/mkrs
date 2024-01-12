import { NextRequest } from 'next/server'
import { JSDOM } from 'jsdom'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ch = searchParams.get('ch')
  const res = await fetch(`https://bkrs.info/slovo.php?ch=${ch}`)
  const text = await res.text()
  const el = new JSDOM(text).window.document.querySelector('#ajax_search .margin_left')
  el?.querySelectorAll('img').forEach((i) => i.remove())
  return new Response(el?.innerHTML)
}
