import { useEffect } from 'react'

type TKeyAction = [keys: string[], callback: (key: string) => void]

export default function useKey(keyActions: TKeyAction[], prevent?: true) {
  useEffect(() => {
    function registerEventListeners(e: KeyboardEvent) {
      if (prevent) e.preventDefault()
      keyActions.forEach((ka) => ka[0].includes(e.key) && ka[1](e.key))
    }
    addEventListener('keypress', registerEventListeners)
    return () => removeEventListener('keypress', registerEventListeners)
  }, [keyActions])
}
