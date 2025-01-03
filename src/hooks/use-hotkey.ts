import { useEffect } from 'react'

export default function useHotkey<Keys extends string[]>(
  keys: Keys,
  callback: (key: Keys[number], event: KeyboardEvent) => void,
  options?: {
    preventDefault?: boolean
  },
) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (keys.includes(e.key)) {
        if (options?.preventDefault === true) {
          e.preventDefault()
        }
        callback(e.key, e)
      }
    }
    addEventListener('keydown', onKeyDown)
    return () => {
      removeEventListener('keydown', onKeyDown)
    }
  }, [keys, options, callback])
}
