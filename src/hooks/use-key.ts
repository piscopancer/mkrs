import { useEffect } from 'react'

type TKeyAction<Keys extends string[]> = [keys: Keys, callback: (key: Keys[number]) => void]

export default function useKey<Keys extends string[]>(keyAction: TKeyAction<Keys>, prevent?: true) {
  useEffect(() => {
    function registerEventListeners(e: KeyboardEvent) {
      if (keyAction[0].includes(e.key)) {
        if (prevent) e.preventDefault()
        keyAction[1](e.key)
      }
    }
    addEventListener('keydown', registerEventListeners)
    return () => removeEventListener('keydown', registerEventListeners)
  }, [keyAction])
}
