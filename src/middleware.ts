import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server'
import { limitRate } from './rate-limit'

export const config: MiddlewareConfig = {
  matcher: '/search/:path*',
}

export async function middleware(request: NextRequest) {
  const tracker = await limitRate()
  console.warn(tracker)
  if (tracker instanceof Error) {
    return NextResponse.json(
      {
        message: 'Fuck you',
      },
      { status: 403 },
    )
  }
}
