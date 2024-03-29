'use server'

import { revalidatePath } from 'next/cache'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'

type TCookies = {
  'hide-info-banner': true | undefined
  'anime-girls': true | undefined
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

export async function hideInfoBanner() {
  setCookie('hide-info-banner', true)
  revalidatePath('/')
}

export async function switchAnimeGirls(value?: boolean) {
  if (value === undefined) {
    if (await hasCookie('anime-girls')) {
      deleteCookie('anime-girls')
    } else {
      setCookie('anime-girls', true)
    }
  } else {
    if (value) {
      setCookie('anime-girls', true)
    } else {
      deleteCookie('anime-girls')
    }
  }
  revalidatePath('/')
  return hasCookie('anime-girls')
}
