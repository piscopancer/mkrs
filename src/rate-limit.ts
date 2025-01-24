'use server'

import { headers } from 'next/headers'

type Ip = string

function getIp(): Ip | Error {
  const forwardedFor = headers().get('x-forwarded-for')
  const realIp = headers().get('x-real-ip')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  if (realIp) {
    return realIp.trim()
  }
  return new Error('IP not found')
}

type Tracker = {
  count: number
  expiresAt: number
}

// lives while the server is up
const trackers = new Map<Ip, Tracker>()

export async function limitRate(rate = 50, perMs = 60000): Promise<{ ip: Ip; tracker: Tracker } | Error> {
  const ip = getIp()
  if (ip instanceof Error) {
    return ip
  }
  if (!trackers.get(ip)) {
    trackers.set(ip, {
      count: 0,
      expiresAt: 0,
    })
  }
  const tracker = trackers.get(ip)!
  if (tracker.expiresAt < Date.now()) {
    tracker.count = 0
    tracker.expiresAt = Date.now() + perMs
  }
  tracker.count++
  if (tracker.count > rate) {
    return new Error('Rate limit exceeded')
  } else {
    return { ip, tracker }
  }
}
