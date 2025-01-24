import { isbot } from 'isbot'
import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server'
import { limitRate } from './rate-limit'

export const config: MiddlewareConfig = {
  matcher: '/search/:path*',
}

// Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 YaBrowser/24.12.0.0 Safari/537.36 ✅
// Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 ?
// Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 YaBrowser/24.12.0.0 Safari/537.36 ?
// Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)

export async function middleware(request: NextRequest) {
  const bot = isbot(request.headers.get('user-agent'))
  if (bot) {
    return NextResponse.error()
  }
  const limiter = await limitRate()
  if (limiter instanceof Error) {
    return NextResponse.error()
  } else {
    console.log(limiter.tracker.count, limiter.ip)
  }
}
