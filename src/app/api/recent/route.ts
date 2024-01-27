export const dynamic = 'force-dynamic'

export async function GET() {
  const res = await fetch('https://bkrs.info').then((res) => res.text())
  return new Response(res)
}
