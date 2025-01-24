import { isbot } from 'isbot'
import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server'

export const config: MiddlewareConfig = {
  matcher: '/search/:path*',
}

export async function middleware(request: NextRequest) {
  const bot = isbot(request.headers.get('user-agent'))
  if (bot) {
    return NextResponse.error()
  }
  // const limiter = await limitRate()
  // if (limiter instanceof Error) {
  //   return NextResponse.error()
  // } else {
  //   console.log(limiter.tracker.count, limiter.ip)
  // }
}
