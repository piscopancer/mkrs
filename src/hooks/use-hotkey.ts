import { useEffect } from 'react'

type THotkey<Keys extends string[]> = [keys: Keys, callback: (key: Keys[number]) => void]

export default function useHotkey<Keys extends string[]>(hotkey: THotkey<Keys>, prevent?: true) {
  useEffect(() => {
    function registerEventListeners(e: KeyboardEvent) {
      if (hotkey[0].includes(e.key)) {
        if (prevent) e.preventDefault()
        hotkey[1](e.key)
      }
    }
    addEventListener('keydown', registerEventListeners)
    return () => removeEventListener('keydown', registerEventListeners)
  }, [hotkey, prevent])
}
