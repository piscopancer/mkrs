'use client'

import { useEffect } from 'react'
import { persistentGeneralStoreProps } from './general'
import { persistentRecentStoreProps } from './recent'
import { persistentSavedStoreProps } from './saved'
import { persistentScannerStoreProps } from './scanner'
import { PersistentStoreProps } from './utils'

export default function PersistentStores() {
  return (
    <>
      <PersistentStore {...(persistentSavedStoreProps as PersistentStoreProps)} />
      <PersistentStore {...(persistentRecentStoreProps as PersistentStoreProps)} />
      <PersistentStore {...(persistentScannerStoreProps as PersistentStoreProps)} />
      <PersistentStore {...(persistentGeneralStoreProps as PersistentStoreProps)} />
    </>
  )
}

function PersistentStore(props: PersistentStoreProps) {
  useEffect(() => {
    let localStorageValue = localStorage.getItem(props.name)
    if (!localStorageValue) return
    localStorageValue = JSON.parse(localStorageValue)
    const parseRes = props.schema.safeParse(localStorageValue)
    if (parseRes.data) {
      props.store.set(props.modify ? props.modify(parseRes.data) : parseRes.data)
    }
    props.after?.(parseRes)
    props.store.onChange((s) => localStorage.setItem(props.name, JSON.stringify(s)))
  }, [])

  return null
}
