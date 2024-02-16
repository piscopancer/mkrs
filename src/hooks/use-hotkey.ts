import { useEffect } from 'react'

type THotkey<Keys extends string[]> = [keys: Keys, callback: (key: Keys[number], event: KeyboardEvent) => void]

export default function useHotkey<Keys extends string[]>(
  hotkey: THotkey<Keys>,
  options?: {
    prevent?: true
  },
) {
  useEffect(() => {
    function registerEventListeners(e: KeyboardEvent) {
      if (hotkey[0].includes(e.key)) {
        if (!options) {
          hotkey[1](e.key, e)
        } else {
          if (options.prevent) e.preventDefault()
          hotkey[1](e.key, e)
        }
      }
    }
    addEventListener('keydown', registerEventListeners)
    return () => removeEventListener('keydown', registerEventListeners)
  }, [hotkey, options])
}
