'use server'

import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'

type TCookies = {
  'hide-welcoming-banner': true | undefined
}

export async function getCookie<N extends keyof TCookies>(name: N) {
  const value = cookies().get(name)?.value
  if (!value) return
  return JSON.parse(value) as TCookies[N]
}

export async function setCookie<N extends keyof TCookies>(name: N, value: NonNullable<TCookies[N]>, options?: Partial<ResponseCookie>) {
  cookies().set(name, JSON.stringify(value), { maxAge: 60 * 60 * 24 * 365, ...options })
}

export async function hasCookie<N extends keyof TCookies>(name: N) {
  return !!cookies().get(name)?.value
}

export async function deleteCookie<N extends keyof TCookies>(name: N) {
  return !!cookies().delete(name)
}
