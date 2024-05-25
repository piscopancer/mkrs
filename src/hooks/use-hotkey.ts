import { useEffect } from 'react'

export default function useHotkey<Keys extends string[]>(
  keys: Keys,
  callback: (key: Keys[number], event: KeyboardEvent) => void,
  options?: {
    prevent?: true
  },
) {
  useEffect(() => {
    function registerEventListeners(e: KeyboardEvent) {
      if (keys.includes(e.key)) {
        if (!options) {
          callback(e.key, e)
        } else {
          if (options.prevent) e.preventDefault()
          callback(e.key, e)
        }
      }
    }
    addEventListener('keydown', registerEventListeners)
    return () => removeEventListener('keydown', registerEventListeners)
  }, [keys, options])
}
