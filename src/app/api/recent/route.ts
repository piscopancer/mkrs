import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const res = await fetch('https://bkrs.info', { headers: request.headers }).then((res) => res.text())
  return new Response(res)
}
