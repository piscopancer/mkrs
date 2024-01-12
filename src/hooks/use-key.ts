import { useEffect } from 'react'

type TKeyAction = [keys: string[], callback: (key: string) => void]

export default function useKey(keyAction: TKeyAction, prevent?: true) {
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
