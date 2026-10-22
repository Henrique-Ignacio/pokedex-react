import { useEffect, useState } from 'react'

// useState que persiste no localStorage (com try/catch caso o storage esteja indisponível)
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* ignora erros de storage */
    }
  }, [key, value])

  return [value, setValue]
}
