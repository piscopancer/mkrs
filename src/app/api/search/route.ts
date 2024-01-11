import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { JSDOM } from 'jsdom'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ch = searchParams.get('ch')
  const res = await fetch(`https://bkrs.info/slovo.php?ch=${ch}`)
  const text = await res.text()
  const d = new JSDOM(text).window.document
  const ru = d.querySelector('.ru')?.textContent

  return Response.json({ data: ru })
}
