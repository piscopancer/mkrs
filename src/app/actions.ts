'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function hideInfoHint() {
  cookies().set('hide-info-banner', '')
  revalidatePath('/')
}
