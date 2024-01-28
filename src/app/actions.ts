'use server'

import { setCookie } from '@/utils'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function hideInfoHint() {
  setCookie(cookies(), 'hide-info-banner', true)
  revalidatePath('/')
}
