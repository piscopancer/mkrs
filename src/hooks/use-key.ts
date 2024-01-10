import { useEffect } from 'react'

type TKeyAction = [keys: string[], callback: (key: string) => void]

export default function useKey(...keyActions: TKeyAction[]) {
  useEffect(() => {
    function registerEventListeners(e: KeyboardEvent) {
      keyActions.forEach((ka) => ka[0].includes(e.key) && ka[1](e.key))
    }
    addEventListener('keypress', registerEventListeners)
    return () => removeEventListener('keypress', registerEventListeners)
  }, [keyActions])
}
