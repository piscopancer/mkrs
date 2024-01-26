import { useEffect } from 'react'

type TShortcut<Keys extends string[]> = [keys: Keys, callback: (key: Keys[number]) => void]

export default function useShortcut<Keys extends string[]>(shortcut: TShortcut<Keys>, prevent?: true) {
  useEffect(() => {
    function registerEventListeners(e: KeyboardEvent) {
      if (shortcut[0].includes(e.key)) {
        if (prevent) e.preventDefault()
        shortcut[1](e.key)
      }
    }
    addEventListener('keydown', registerEventListeners)
    return () => removeEventListener('keydown', registerEventListeners)
  }, [shortcut, prevent])
}
