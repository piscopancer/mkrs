'use server'

import { setCookie } from '@/utils'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function hideInfoHint() {
  setCookie(cookies(), 'hide-info-banner', true, { maxAge: 60 * 60 * 24 * 365 })
  revalidatePath('/')
}
