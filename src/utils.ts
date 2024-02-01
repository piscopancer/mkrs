import { HTMLMotionProps } from 'framer-motion'
import { domToReact, htmlToDOM } from 'html-react-parser'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'
import { ComponentProps, ReactHTML } from 'react'
import { useSnapshot } from 'valtio'

export type TNextPage<ParamsAlias extends string | never = never, SearchParams extends string[] = []> = {
  params: ParamsAlias extends never ? never : Record<ParamsAlias, string>
  searchParams: Record<SearchParams[number], string | null>
}

export function objectEntries<O extends object>(obj?: O) {
  return Object.entries(obj ?? {}) as [keyof O, O[keyof O]][]
}

export type TOmit<T extends { [K in string]: unknown }, K extends keyof T> = Omit<T, K>

export async function wait(seconds: number) {
  return new Promise((res) => setTimeout(res, seconds * 1000))
}

export function classes(...classes: (string | false | undefined)[]): string | undefined {
  const cleaned = classes.filter(Boolean) as string[]
  if (cleaned.length === 0) return
  return cleaned.reduce((total, next) => `${total} ${next}`)
}

export function randomFromArray<T>(array: T[]): T {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

export function assignObject<T extends {} | undefined>(obj: T, newObj: T) {
  obj ? Object.assign(obj, newObj) : () => (obj = newObj)
}

export type TRedefineObject<T, P extends Partial<Record<keyof T, unknown>>> = {
  [K in keyof T]: K extends keyof P ? P[K] : T[K]
}

export function cutStart(whole: string, length: number) {
  let firstPart = whole.slice(0, length)
  let secondPart = whole.slice(length)
  return [firstPart, secondPart] as const
}

export function stringToReact(str: string) {
  return domToReact(htmlToDOM(str))
}

export function parseLsForStore<T extends object>(storeName: string) {
  const storeString = localStorage.getItem(storeName)
  if (!storeString) return
  return JSON.parse(storeString) as T
}

export type TSnapshot<T extends object> = ReturnType<typeof useSnapshot<T>>

type TCookies = {
  'hide-info-banner': true
}

export function getCookie<N extends keyof TCookies>(store: ReturnType<typeof cookies>, name: N) {
  const value = store.get(name)?.value
  if (!value) return
  return JSON.parse(value) as TCookies[N]
}

export function setCookie<N extends keyof TCookies>(store: ReturnType<typeof cookies>, name: N, value: TCookies[N], options?: Partial<ResponseCookie>) {
  return store.set(name, JSON.stringify(value), options)
}

export type TComponent<T extends keyof ReactHTML, P extends object> = ComponentProps<T> & { props: P }

export type TMotionComponent<T extends keyof ReactHTML, P extends object> = HTMLMotionProps<T> & { props: P }
